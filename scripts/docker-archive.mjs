import { createHash } from 'node:crypto'
import { posix } from 'node:path'
import { list as listTar } from 'tar'

const MAX_MANIFEST_BYTES = 1024 * 1024
const MAX_CONFIG_BYTES = 16 * 1024 * 1024
const OCI_INDEX_MEDIA_TYPES = new Set([
  'application/vnd.oci.image.index.v1+json',
  'application/vnd.docker.distribution.manifest.list.v2+json',
])
const OCI_MANIFEST_MEDIA_TYPES = new Set([
  'application/vnd.oci.image.manifest.v1+json',
  'application/vnd.docker.distribution.manifest.v2+json',
])

function regularEntry(entry, label) {
  if (entry.type !== 'File' && entry.type !== 'OldFile') {
    throw new Error(`${label} is not a regular file`)
  }
}

async function readArchiveFile(archivePath, targetPath, maximumBytes, label) {
  let found = 0
  let readError
  const pending = []
  await listTar({
    file: archivePath,
    noResume: true,
    strict: true,
    onReadEntry(entry) {
      if (entry.path !== targetPath) {
        entry.resume()
        return
      }
      found += 1
      try {
        regularEntry(entry, label)
      } catch (error) {
        readError ??= error
        entry.resume()
        return
      }
      const chunks = []
      let bytes = 0
      pending.push(new Promise((resolve, reject) => {
        entry.on('data', (chunk) => {
          bytes += chunk.length
          if (bytes > maximumBytes) {
            readError ??= new Error(`${label} exceeds ${maximumBytes} bytes`)
            return
          }
          chunks.push(chunk)
        })
        entry.on('error', reject)
        entry.on('end', () => resolve(Buffer.concat(chunks)))
        entry.resume()
      }))
    },
  })
  const bodies = await Promise.all(pending)
  if (readError) throw readError
  if (found !== 1 || bodies.length !== 1) {
    throw new Error(`Docker archive must contain exactly one ${label}`)
  }
  return bodies[0]
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
