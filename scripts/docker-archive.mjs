import { createHash } from 'node:crypto'
import { constants } from 'node:fs'
import { open } from 'node:fs/promises'
import { posix } from 'node:path'

const MAX_MANIFEST_BYTES = 1024 * 1024
const MAX_CONFIG_BYTES = 16 * 1024 * 1024
const MAX_ARCHIVE_BYTES = 8 * 1024 * 1024 * 1024
const TAR_BLOCK_BYTES = 512
const TAR_PADDING_READ_BYTES = 1024 * 1024
const OCI_INDEX_MEDIA_TYPES = new Set([
  'application/vnd.oci.image.index.v1+json',
  'application/vnd.docker.distribution.manifest.list.v2+json',
])
const OCI_MANIFEST_MEDIA_TYPES = new Set([
  'application/vnd.oci.image.manifest.v1+json',
  'application/vnd.docker.distribution.manifest.v2+json',
])

function tarNumber(field, label) {
  if ((field[0] & 0x80) !== 0) throw new Error(`${label} uses an unsupported base-256 value`)
  const value = field.toString('ascii').replace(/\0.*$/s, '').trim()
  if (!/^[0-7]+$/.test(value)) throw new Error(`${label} is not a canonical octal value`)
  const parsed = Number.parseInt(value, 8)
  if (!Number.isSafeInteger(parsed)) throw new Error(`${label} exceeds the safe integer range`)
  return parsed
}

function tarText(field, label) {
  const terminator = field.indexOf(0)
  const body = terminator === -1 ? field : field.subarray(0, terminator)
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(body)
  } catch {
    throw new Error(`${label} is not valid UTF-8`)
  }
}

function tarHeader(header) {
  const storedChecksum = tarNumber(header.subarray(148, 156), 'Tar header checksum')
  let actualChecksum = 0
  for (let index = 0; index < header.length; index += 1) {
    actualChecksum += index >= 148 && index < 156 ? 32 : header[index]
  }
  if (actualChecksum !== storedChecksum) throw new Error('Docker archive tar header checksum is invalid')
  const name = tarText(header.subarray(0, 100), 'Tar entry name')
  const prefix = tarText(header.subarray(345, 500), 'Tar entry prefix')
  const path = prefix ? `${prefix}/${name}` : name
  if (!path) throw new Error('Docker archive contains an empty tar entry path')
  const type = header[156]
  if ([0x4c, 0x4b, 0x78, 0x67].includes(type)) {
    throw new Error('Docker archive contains an ambiguous tar extension record')
  }
  return {
    path,
    regular: type === 0 || type === 0x30,
    size: tarNumber(header.subarray(124, 136), `Tar entry size for ${path}`),
  }
}

async function readExact(handle, length, position, label) {
  const body = Buffer.alloc(length)
  let offset = 0
  while (offset < length) {
    const { bytesRead } = await handle.read(body, offset, length - offset, position + offset)
    if (bytesRead < 1) throw new Error(`${label} is truncated`)
    offset += bytesRead
  }
  return body
}

async function readArchiveFile(archivePath, targetPath, maximumBytes, label) {
  const handle = await open(archivePath, constants.O_RDONLY | constants.O_NOFOLLOW)
  try {
    const metadata = await handle.stat()
    if (
      !metadata.isFile()
      || metadata.size < TAR_BLOCK_BYTES * 3
      || metadata.size > MAX_ARCHIVE_BYTES
      || metadata.size % TAR_BLOCK_BYTES !== 0
    ) {
      throw new Error('Docker archive must be one bounded regular file')
    }
    let position = 0
    let found = 0
    let result
    let terminated = false
    while (position + TAR_BLOCK_BYTES <= metadata.size) {
      const header = await readExact(handle, TAR_BLOCK_BYTES, position, 'Docker archive tar header')
      if (header.every((byte) => byte === 0)) {
        const terminator = await readExact(
          handle,
          TAR_BLOCK_BYTES,
          position + TAR_BLOCK_BYTES,
          'Docker archive tar terminator',
        )
        if (!terminator.every((byte) => byte === 0)) {
          throw new Error('Docker archive tar terminator is invalid')
        }
        let paddingPosition = position + TAR_BLOCK_BYTES * 2
        while (paddingPosition < metadata.size) {
          const paddingLength = Math.min(TAR_PADDING_READ_BYTES, metadata.size - paddingPosition)
          const padding = await readExact(
            handle,
            paddingLength,
            paddingPosition,
            'Docker archive tar padding',
          )
          if (padding.some((byte) => byte !== 0)) {
            throw new Error('Docker archive contains non-zero data after its tar terminator')
          }
          paddingPosition += paddingLength
        }
        terminated = true
        break
      }
      const entry = tarHeader(header)
      const paddedSize = Math.ceil(entry.size / TAR_BLOCK_BYTES) * TAR_BLOCK_BYTES
      const nextPosition = position + TAR_BLOCK_BYTES + paddedSize
      if (!Number.isSafeInteger(nextPosition) || nextPosition > metadata.size) {
        throw new Error(`Docker archive entry is truncated: ${entry.path}`)
      }
      if (entry.path === targetPath) {
        found += 1
        if (!entry.regular) throw new Error(`${label} is not a regular file`)
        if (entry.size > maximumBytes) throw new Error(`${label} exceeds ${maximumBytes} bytes`)
        result = await readExact(handle, entry.size, position + TAR_BLOCK_BYTES, label)
      }
      position = nextPosition
    }
    if (!terminated) throw new Error('Docker archive tar terminator is missing')
    if (found !== 1 || !result) {
      throw new Error(`Docker archive must contain exactly one ${label}`)
    }
    return result
  } finally {
    await handle.close()
  }
}

function safeConfigPath(path) {
  if (
    typeof path !== 'string'
    || path.length === 0
    || path.includes('\\')
    || path.includes('\0')
    || posix.isAbsolute(path)
    || posix.normalize(path) !== path
    || path.split('/').some((segment) => !segment || segment === '.' || segment === '..')
  ) {
    throw new Error('Unsafe Docker archive config path')
  }
  if (
    !/^[0-9a-f]{64}\.json$/.test(path)
    && !/^blobs\/sha256\/[0-9a-f]{64}$/.test(path)
  ) {
    throw new Error('Unsafe Docker archive config path')
  }
  return path
}

function parseJson(body, label) {
  try {
    return JSON.parse(body.toString('utf8'))
  } catch {
    throw new Error(`${label} is invalid JSON`)
  }
}

function exactDigest(value, label) {
  if (typeof value !== 'string' || !/^sha256:[0-9a-f]{64}$/.test(value)) {
    throw new Error(`${label} must use an exact sha256 digest`)
  }
  return value
}

function exactDescriptor(value, mediaTypes, label) {
  if (
    !value
    || typeof value !== 'object'
    || Array.isArray(value)
    || !mediaTypes.has(value.mediaType)
    || !Number.isSafeInteger(value.size)
    || value.size < 1
  ) {
    throw new Error(`${label} is invalid`)
  }
  return { ...value, digest: exactDigest(value.digest, `${label} digest`) }
}

async function readDigestBlob(archivePath, descriptor, label) {
  const digestHex = descriptor.digest.slice('sha256:'.length)
  const body = await readArchiveFile(
    archivePath,
    `blobs/sha256/${digestHex}`,
    MAX_CONFIG_BYTES,
    label,
  )
  const actualDigest = `sha256:${createHash('sha256').update(body).digest('hex')}`
  if (actualDigest !== descriptor.digest || body.length !== descriptor.size) {
    throw new Error(`${label} bytes do not match its OCI descriptor`)
  }
  return body
}

async function verifyOciImageId(archivePath, expectedImageId, configImageId) {
  let archiveIndexBody
  try {
    archiveIndexBody = await readArchiveFile(
      archivePath,
      'index.json',
      MAX_MANIFEST_BYTES,
      'index.json',
    )
  } catch (error) {
    if (error.message === 'Docker archive must contain exactly one index.json') {
      throw new Error(
        `Docker archive config digest mismatch: expected ${expectedImageId}, received ${configImageId}`,
      )
    }
    throw error
  }
  const archiveIndex = parseJson(
    archiveIndexBody,
    'Docker archive index.json',
  )
  if (
    archiveIndex?.schemaVersion !== 2
    || !OCI_INDEX_MEDIA_TYPES.has(archiveIndex.mediaType)
    || !Array.isArray(archiveIndex.manifests)
    || archiveIndex.manifests.length !== 1
  ) {
    throw new Error('Docker archive must contain one exact OCI image descriptor')
  }
  const topDescriptor = exactDescriptor(
    archiveIndex.manifests[0],
    new Set([...OCI_INDEX_MEDIA_TYPES, ...OCI_MANIFEST_MEDIA_TYPES]),
    'Docker archive OCI image descriptor',
  )
  if (topDescriptor.digest !== expectedImageId) {
    throw new Error(
      `Docker archive image digest mismatch: expected ${expectedImageId}, received ${topDescriptor.digest}`,
    )
  }
  let manifestDescriptor = topDescriptor
  if (OCI_INDEX_MEDIA_TYPES.has(topDescriptor.mediaType)) {
    const imageIndex = parseJson(
      await readDigestBlob(archivePath, topDescriptor, 'OCI image index'),
      'OCI image index',
    )
    if (
      imageIndex?.schemaVersion !== 2
      || !OCI_INDEX_MEDIA_TYPES.has(imageIndex.mediaType)
      || !Array.isArray(imageIndex.manifests)
    ) {
      throw new Error('OCI image index is invalid')
    }
    const runnable = imageIndex.manifests.filter((descriptor) => (
      OCI_MANIFEST_MEDIA_TYPES.has(descriptor?.mediaType)
      && descriptor?.platform?.os !== 'unknown'
      && descriptor?.platform?.architecture !== 'unknown'
    ))
    if (runnable.length !== 1) {
      throw new Error('OCI image index must identify exactly one runnable platform manifest')
    }
    manifestDescriptor = exactDescriptor(
      runnable[0],
      OCI_MANIFEST_MEDIA_TYPES,
      'OCI platform manifest descriptor',
    )
  }
  const imageManifest = parseJson(
    await readDigestBlob(archivePath, manifestDescriptor, 'OCI platform manifest'),
    'OCI platform manifest',
  )
  if (
    imageManifest?.schemaVersion !== 2
    || !OCI_MANIFEST_MEDIA_TYPES.has(imageManifest.mediaType)
    || exactDigest(imageManifest.config?.digest, 'OCI image config digest') !== configImageId
  ) {
    throw new Error('OCI platform manifest does not bind the Docker archive config')
  }
}

export async function verifyDockerArchiveImageId(archivePath, expectedImageId) {
  if (!/^sha256:[0-9a-f]{64}$/.test(expectedImageId)) {
    throw new Error('Expected image ID must be an exact sha256 digest')
  }
  const manifestBody = await readArchiveFile(
    archivePath,
    'manifest.json',
    MAX_MANIFEST_BYTES,
    'manifest.json',
  )
  const manifest = parseJson(manifestBody, 'Docker archive manifest')
  if (!Array.isArray(manifest) || manifest.length !== 1 || !manifest[0]) {
    throw new Error('Docker archive must contain exactly one image')
  }
  const configPath = safeConfigPath(manifest[0].Config)
  const configBody = await readArchiveFile(
    archivePath,
    configPath,
    MAX_CONFIG_BYTES,
    'image config',
  )
  const actualImageId = `sha256:${createHash('sha256').update(configBody).digest('hex')}`
  if (actualImageId === expectedImageId) {
    return { configPath, configImageId: actualImageId, imageId: expectedImageId }
  }
  await verifyOciImageId(archivePath, expectedImageId, actualImageId)
  return { configPath, configImageId: actualImageId, imageId: expectedImageId }
}
