import { execFile } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import { constants } from 'node:fs'
import {
  chmod,
  lstat,
  mkdir,
  mkdtemp,
  open,
  readlink,
  realpath,
  rename,
  rm,
  symlink,
} from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

import { approvalPublicKey } from './owner-approval.mjs'

const exec = promisify(execFile)
const TAR_EXECUTABLE = '/usr/bin/tar'
const MAX_ARCHIVE_BYTES = 64 * 1024 * 1024
const MAX_FILE_BYTES = 8 * 1024 * 1024
const ARCHIVE_PATHS = [
  'controller-manifest.json',
  'config/kryv-teal-production-controller.sudoers',
  'config/kryv-teal-production-observation.service',
  'config/kryv-teal-production-observation.timer',
  'config/release-owner-approval.json',
  'lib/assemble-release-candidate.mjs',
  'lib/docker-archive.mjs',
  'lib/kryv_teal_production_controller.mjs',
  'lib/owner-approval.mjs',
  'lib/teal_owner_authority.mjs',
  'lib/teal_release_candidate.mjs',
]
const MANIFEST_FIELDS = new Set(['files', 'requiredNodeVersion', 'schemaVersion'])
const FILE_FIELDS = new Set(['bytes', 'path', 'sha256'])

function exactFields(value, fields, label) {
  if (
    !value
    || Array.isArray(value)
    || typeof value !== 'object'
    || Object.keys(value).length !== fields.size
    || Object.keys(value).some((field) => !fields.has(field))
  ) {
    throw new Error(`${label} fields are invalid`)
  }
}

async function trustedTargetRoot(path, requiredOwnerUid) {
  const root = resolve(path)
  const metadata = await lstat(root)
  if (
    !metadata.isDirectory()
    || metadata.isSymbolicLink()
    || await realpath(root) !== root
    || metadata.uid !== requiredOwnerUid
    || (metadata.mode & 0o022) !== 0
  ) {
    throw new Error('Installation target root is not owner-controlled')
  }
  return root
}

async function copyAndHashArchive(source, destination) {
  let input
  let output
  const hash = createHash('sha256')
  try {
    input = await open(resolve(source), constants.O_RDONLY | constants.O_NOFOLLOW)
    const before = await input.stat({ bigint: true })
    if (!before.isFile() || before.size < 1n || before.size > BigInt(MAX_ARCHIVE_BYTES)) {
      throw new Error('Controller archive is not a bounded regular file')
    }
    output = await open(
      destination,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
      0o600,
    )
    const buffer = Buffer.allocUnsafe(1024 * 1024)
    let offset = 0n
    while (offset < before.size) {
      const length = Number(before.size - offset > BigInt(buffer.length)
        ? BigInt(buffer.length)
        : before.size - offset)
      const { bytesRead } = await input.read(buffer, 0, length, Number(offset))
      if (bytesRead < 1) throw new Error('Controller archive ended during copy')
      hash.update(buffer.subarray(0, bytesRead))
      let written = 0
      while (written < bytesRead) {
        const result = await output.write(buffer, written, bytesRead - written, Number(offset) + written)
        if (result.bytesWritten < 1) throw new Error('Controller archive copy made no progress')
        written += result.bytesWritten
      }
      offset += BigInt(bytesRead)
    }
    await output.sync()
    const after = await input.stat({ bigint: true })
    if (
      before.dev !== after.dev
      || before.ino !== after.ino
      || before.size !== after.size
      || before.mtimeNs !== after.mtimeNs
      || before.ctimeNs !== after.ctimeNs
    ) {
      throw new Error('Controller archive changed during copy')
    }
    return `sha256:${hash.digest('hex')}`
  } finally {
    await output?.close()
    await input?.close()
  }
}

async function stableFile(path, maximumBytes = MAX_FILE_BYTES) {
  let handle
  try {
    handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW)
    const before = await handle.stat({ bigint: true })
    if (!before.isFile() || before.size < 1n || before.size > BigInt(maximumBytes)) {
      throw new Error(`Installed input is not a bounded regular file: ${path}`)
    }
    const chunks = []
    for await (const chunk of handle.createReadStream({ autoClose: false })) chunks.push(chunk)
    const after = await handle.stat({ bigint: true })
    if (
      before.dev !== after.dev
      || before.ino !== after.ino
      || before.size !== after.size
      || before.mtimeNs !== after.mtimeNs
      || before.ctimeNs !== after.ctimeNs
    ) {
      throw new Error(`Installed input changed while read: ${path}`)
    }
    return Buffer.concat(chunks)
  } finally {
    await handle?.close()
  }
}

function normalizeManifest(value) {
  exactFields(value, MANIFEST_FIELDS, 'Controller manifest')
  if (value.schemaVersion !== 1 || value.requiredNodeVersion !== '24.19.0' || !Array.isArray(value.files)) {
    throw new Error('Controller manifest identity is invalid')
  }
  const expected = ARCHIVE_PATHS.slice(1)
  const seen = new Set()
  const files = value.files.map((file) => {
    exactFields(file, FILE_FIELDS, 'Controller manifest file')
    if (
      !expected.includes(file.path)
      || seen.has(file.path)
      || !Number.isSafeInteger(file.bytes)
      || file.bytes < 1
      || file.bytes > MAX_FILE_BYTES
      || !/^sha256:[0-9a-f]{64}$/.test(file.sha256)
    ) {
      throw new Error('Controller manifest file identity is invalid')
    }
    seen.add(file.path)
    return { ...file }
  }).sort((left, right) => left.path.localeCompare(right.path))
  if (JSON.stringify(files.map(({ path }) => path)) !== JSON.stringify(expected)) {
    throw new Error('Controller archive file closure is incomplete')
  }
  return { schemaVersion: 1, requiredNodeVersion: value.requiredNodeVersion, files }
}

async function validateExtractedArchive(extractedRoot) {
  const manifestPath = join(extractedRoot, 'controller-manifest.json')
  let parsed
  try {
    parsed = JSON.parse((await stableFile(manifestPath)).toString('utf8'))
  } catch {
    throw new Error('Controller manifest is invalid JSON')
  }
  const manifest = normalizeManifest(parsed)
  const canonical = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`)
  if (!canonical.equals(await stableFile(manifestPath))) {
    throw new Error('Controller manifest is not canonical')
  }
  for (const file of manifest.files) {
    const path = join(extractedRoot, file.path)
    const metadata = await lstat(path)
    const bytes = await stableFile(path)
    if (
      !metadata.isFile()
      || metadata.isSymbolicLink()
      || metadata.size !== file.bytes
      || `sha256:${createHash('sha256').update(bytes).digest('hex')}` !== file.sha256
    ) {
      throw new Error(`Controller archive file digest mismatch: ${file.path}`)
    }
  }
  return manifest
}

async function syncDirectory(path) {
  const handle = await open(path, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW)
  try {
    await handle.sync()
  } finally {
    await handle.close()
  }
}

async function ensureDirectory(path, mode, requiredOwnerUid) {
  await mkdir(path, { recursive: true, mode })
  const metadata = await lstat(path)
  if (
    !metadata.isDirectory()
    || metadata.isSymbolicLink()
    || metadata.uid !== requiredOwnerUid
    || (metadata.mode & 0o777) !== mode
  ) {
    throw new Error(`Installed directory has unsafe ownership or mode: ${path}`)
  }
}

async function atomicInstall(path, bytes, mode, requiredOwnerUid) {
  const parent = dirname(path)
  await mkdir(parent, { recursive: true, mode: 0o755 })
  const pending = join(parent, `.${path.split('/').at(-1)}.pending-${process.pid}-${randomBytes(8).toString('hex')}`)
  let handle
  try {
    handle = await open(
      pending,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
      mode,
    )
    let offset = 0
    while (offset < bytes.length) {
      const { bytesWritten } = await handle.write(bytes, offset, bytes.length - offset, offset)
      if (bytesWritten < 1) throw new Error('Installation write made no progress')
      offset += bytesWritten
    }
    await handle.sync()
    await chmod(pending, mode)
    const metadata = await handle.stat()
    if (
      !metadata.isFile()
      || metadata.uid !== requiredOwnerUid
      || (metadata.mode & 0o777) !== mode
      || metadata.size !== bytes.length
    ) {
      throw new Error('Installed file metadata is invalid')
    }
    await handle.close()
    handle = undefined
    await rename(pending, path)
    await syncDirectory(parent)
  } finally {
    await handle?.close()
    await rm(pending, { force: true })
  }
}

async function installStaticBootstrap(path, bytes, mode, requiredOwnerUid) {
  try {
    const metadata = await lstat(path)
    if (
      !metadata.isFile()
      || metadata.isSymbolicLink()
      || metadata.uid !== requiredOwnerUid
      || (metadata.mode & 0o777) !== mode
      || !(await stableFile(path)).equals(bytes)
    ) {
      throw new Error(`Installed bootstrap conflicts with the immutable bootstrap contract: ${path}`)
    }
    return
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
  await atomicInstall(path, bytes, mode, requiredOwnerUid)
}

function destination(targetRoot, path) {
  return join(targetRoot, path)
}

function generationMode(path) {
  if (path === 'config/kryv-teal-production-controller.sudoers') return 0o440
  return 0o444
}

async function installGeneration({
  archiveDigest,
  extractedRoot,
  manifest,
  ownerPublicKeyPem,
  requiredOwnerUid,
  targetRoot,
}) {
  const version = archiveDigest.slice('sha256:'.length)
  const generationParent = destination(targetRoot, 'usr/local/share/kryv-teal-production')
  const generationsRoot = join(generationParent, 'generations')
  await ensureDirectory(generationParent, 0o755, requiredOwnerUid)
  await ensureDirectory(generationsRoot, 0o755, requiredOwnerUid)
  const target = join(generationsRoot, version)
  const expectedFiles = [
    ...manifest.files,
    {
      path: 'config/owner.pub.pem',
      bytes: Buffer.byteLength(ownerPublicKeyPem),
      sha256: `sha256:${createHash('sha256').update(ownerPublicKeyPem).digest('hex')}`,
      mode: 0o400,
    },
    {
      path: 'controller-archive.sha256',
      bytes: Buffer.byteLength(`${archiveDigest}\n`),
      sha256: `sha256:${createHash('sha256').update(`${archiveDigest}\n`).digest('hex')}`,
      mode: 0o444,
    },
  ]
  try {
    const metadata = await lstat(target)
    if (
      !metadata.isDirectory()
      || metadata.isSymbolicLink()
      || metadata.uid !== requiredOwnerUid
      || (metadata.mode & 0o777) !== 0o555
    ) {
      throw new Error('Existing controller version directory is untrusted')
    }
    for (const file of expectedFiles) {
      const installedPath = join(target, file.path)
      const installedMetadata = await lstat(installedPath)
      if (
        !installedMetadata.isFile()
        || installedMetadata.isSymbolicLink()
        || installedMetadata.uid !== requiredOwnerUid
        || (installedMetadata.mode & 0o777) !== (file.mode ?? generationMode(file.path))
      ) {
        throw new Error('Existing controller version file is untrusted')
      }
      const installed = await stableFile(installedPath)
      if (`sha256:${createHash('sha256').update(installed).digest('hex')}` !== file.sha256) {
        throw new Error('Existing controller version conflicts with the approved archive')
      }
    }
    return target
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }

  const pending = join(generationsRoot, `.${version}.pending-${process.pid}-${randomBytes(8).toString('hex')}`)
  try {
    await mkdir(pending, { mode: 0o700 })
    for (const file of manifest.files) {
      await atomicInstall(
        join(pending, file.path),
        await stableFile(join(extractedRoot, file.path)),
        generationMode(file.path),
        requiredOwnerUid,
      )
    }
    await atomicInstall(
      join(pending, 'config/owner.pub.pem'),
      Buffer.from(ownerPublicKeyPem),
      0o400,
      requiredOwnerUid,
    )
    await atomicInstall(
      join(pending, 'controller-archive.sha256'),
      Buffer.from(`${archiveDigest}\n`),
      0o444,
      requiredOwnerUid,
    )
    await chmod(join(pending, 'config'), 0o555)
    await chmod(join(pending, 'lib'), 0o555)
    await chmod(pending, 0o555)
    await rename(pending, target)
    await syncDirectory(generationsRoot)
    return target
  } catch (error) {
    await rm(pending, { recursive: true, force: true })
    throw error
  }
}

async function currentGenerationTarget(selector, requiredOwnerUid) {
  try {
    const metadata = await lstat(selector)
    if (!metadata.isSymbolicLink() || metadata.uid !== requiredOwnerUid) {
      throw new Error('Controller generation selector is untrusted')
    }
    const target = await readlink(selector)
    if (!/^generations\/[0-9a-f]{64}$/.test(target)) {
      throw new Error('Controller generation selector target is invalid')
    }
    return target
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined
    throw error
  }
}

async function switchGeneration(selector, target, requiredOwnerUid) {
  const parent = await trustedTargetRoot(dirname(selector), requiredOwnerUid)
  const previous = await currentGenerationTarget(selector, requiredOwnerUid)
  const pending = join(parent, `.current.pending-${process.pid}-${randomBytes(8).toString('hex')}`)
  try {
    await symlink(target, pending)
    const metadata = await lstat(pending)
    if (!metadata.isSymbolicLink() || metadata.uid !== requiredOwnerUid || await readlink(pending) !== target) {
      throw new Error('Pending controller generation selector is invalid')
    }
    await rename(pending, selector)
    await syncDirectory(parent)
  } finally {
    await rm(pending, { force: true })
  }
  return previous
}

async function restoreGeneration(selector, previous, requiredOwnerUid) {
  if (previous) {
    await switchGeneration(selector, previous, requiredOwnerUid)
    return
  }
  const parent = await trustedTargetRoot(dirname(selector), requiredOwnerUid)
  const selected = await currentGenerationTarget(selector, requiredOwnerUid)
  if (selected) {
    await rm(selector)
    await syncDirectory(parent)
  }
}

async function hostPreflight(targetRoot, activate) {
  if (!activate) return
  if (targetRoot !== '/' || process.getuid?.() !== 0) {
    throw new Error('Controller activation requires root and target root /')
  }
  if (process.env.KRYV_TEAL_INSTALLER_LOCKED !== '1') {
    throw new Error('Controller activation requires the shared production lock')
  }
  const node = await exec('/usr/bin/node', ['--version'], {
    encoding: 'utf8',
    env: { PATH: '/usr/bin:/bin', LANG: 'C.UTF-8' },
    timeout: 10_000,
  })
  if (node.stdout.trim() !== 'v24.19.0') {
    throw new Error('Production controller requires /usr/bin/node v24.19.0')
  }
  for (const path of ['/usr/bin/docker', '/usr/bin/curl', '/usr/bin/flock', '/usr/bin/systemctl', '/usr/sbin/visudo']) {
    const metadata = await lstat(path)
    if (!metadata.isFile() || metadata.isSymbolicLink()) {
      throw new Error(`Required production executable is unavailable: ${path}`)
    }
  }
}

export async function installProductionController({
  activate,
  archive,
  archiveSha256,
  ownerPublicKeyPem,
  requiredOwnerUid = 0,
  targetRoot,
}) {
  if (!/^sha256:[0-9a-f]{64}$/.test(archiveSha256)) {
    throw new Error('Expected controller archive digest is invalid')
  }
  const root = await trustedTargetRoot(targetRoot, requiredOwnerUid)
  await hostPreflight(root, activate)
  const temporary = await mkdtemp(join(resolve('/var/tmp'), 'teal-controller-install-'))
  const copiedArchive = join(temporary, 'controller.tar')
  const extractedRoot = join(temporary, 'extracted')
  try {
    await mkdir(extractedRoot, { mode: 0o700 })
    const actualArchiveSha256 = await copyAndHashArchive(archive, copiedArchive)
    if (actualArchiveSha256 !== archiveSha256) {
      throw new Error('Controller archive digest mismatch')
    }
    const listed = await exec(TAR_EXECUTABLE, ['--list', '--file', copiedArchive], {
      encoding: 'utf8',
      env: { PATH: '/usr/bin:/bin', LANG: 'C.UTF-8' },
      maxBuffer: 1024 * 1024,
      timeout: 30_000,
    })
    const paths = listed.stdout.trim().split('\n').filter(Boolean)
    if (JSON.stringify(paths) !== JSON.stringify(ARCHIVE_PATHS)) {
      throw new Error('Controller archive path closure is invalid')
    }
    const verbose = await exec(TAR_EXECUTABLE, ['--list', '--verbose', '--file', copiedArchive], {
      encoding: 'utf8',
      env: { PATH: '/usr/bin:/bin', LANG: 'C.UTF-8' },
      maxBuffer: 1024 * 1024,
      timeout: 30_000,
    })
    const entries = verbose.stdout.trim().split('\n').filter(Boolean)
    if (entries.length !== ARCHIVE_PATHS.length || entries.some((line) => !line.startsWith('-'))) {
      throw new Error('Controller archive contains a non-regular entry')
    }
    await exec(TAR_EXECUTABLE, [
      '--extract',
      '--file',
      copiedArchive,
      '--directory',
      extractedRoot,
      '--no-same-owner',
      '--no-same-permissions',
    ], {
      encoding: 'utf8',
      env: { PATH: '/usr/bin:/bin', LANG: 'C.UTF-8' },
      maxBuffer: 1024 * 1024,
      timeout: 30_000,
    })
    const manifest = await validateExtractedArchive(extractedRoot)
    const trustAnchorBytes = await stableFile(join(extractedRoot, 'config/release-owner-approval.json'))
    let trustAnchor
    try {
      trustAnchor = JSON.parse(trustAnchorBytes.toString('utf8'))
    } catch {
      throw new Error('Controller trust anchor is invalid JSON')
    }
    if (
      trustAnchor?.schemaVersion !== 2
      || trustAnchor.algorithm !== 'Ed25519'
      || trustAnchor.owner !== 'kryv-owner'
      || trustAnchor.repository !== 'platypus27/teal'
      || trustAnchor.workflow !== 'platypus27/teal/.github/workflows/protected-release.yml'
      || trustAnchor.ref !== 'refs/heads/master'
      || trustAnchor.operationEnvironments?.['npm-publish'] !== 'teal-release'
      || trustAnchor.operationEnvironments?.['docs-deploy'] !== 'teal-production'
    ) {
      throw new Error('Controller trust anchor context is invalid')
    }
    const key = approvalPublicKey(ownerPublicKeyPem)
    if (key.fingerprint !== trustAnchor.publicKeyFingerprint) {
      throw new Error('Owner public key fingerprint differs from the controller trust anchor')
    }

    if (activate) {
      await exec('/usr/sbin/visudo', [
        '-cf',
        join(extractedRoot, 'config/kryv-teal-production-controller.sudoers'),
      ], { encoding: 'utf8', timeout: 10_000 })
    }

    const generationRoot = await installGeneration({
      archiveDigest: archiveSha256,
      extractedRoot,
      manifest,
      ownerPublicKeyPem,
      requiredOwnerUid,
      targetRoot: root,
    })
    const stateRoot = destination(root, 'var/lib/kryv-teal-production')
    await ensureDirectory(stateRoot, 0o700, requiredOwnerUid)
    await ensureDirectory(join(stateRoot, 'consumed-approvals'), 0o700, requiredOwnerUid)
    await ensureDirectory(join(stateRoot, 'releases'), 0o700, requiredOwnerUid)

    const bootstraps = [
      ['config/kryv-teal-production-observation.service', 'etc/systemd/system/kryv-teal-production-observation.service', 0o444],
      ['config/kryv-teal-production-observation.timer', 'etc/systemd/system/kryv-teal-production-observation.timer', 0o444],
      ['config/kryv-teal-production-controller.sudoers', 'etc/sudoers.d/kryv-teal-production-controller', 0o440],
    ]
    for (const [source, target, mode] of bootstraps) {
      await installStaticBootstrap(
        destination(root, target),
        await stableFile(join(extractedRoot, source)),
        mode,
        requiredOwnerUid,
      )
    }
    const controllerPath = destination(
      root,
      'usr/local/share/kryv-teal-production/current/lib/kryv_teal_production_controller.mjs',
    )
    const runtimeControllerPath = '/usr/local/share/kryv-teal-production/current/lib/kryv_teal_production_controller.mjs'
    const wrapper = Buffer.from(`#!/bin/sh
set -eu
test "$(/usr/bin/node --version)" = v24.19.0
exec /usr/bin/flock --exclusive --nonblock /run/lock/kryv-teal-production.lock /usr/bin/env -i PATH=/usr/bin:/bin LANG=C.UTF-8 KRYV_TEAL_CONTROLLER_LOCKED=1 /usr/bin/node --disable-proto=throw --frozen-intrinsics --jitless ${runtimeControllerPath} "$@"
`)
    await installStaticBootstrap(
      destination(root, 'usr/local/libexec/kryv-teal-production-controller'),
      wrapper,
      0o555,
      requiredOwnerUid,
    )

    const selector = destination(root, 'usr/local/share/kryv-teal-production/current')
    const generationTarget = join('generations', archiveSha256.slice('sha256:'.length))
    const previousGeneration = await switchGeneration(selector, generationTarget, requiredOwnerUid)
    try {
      if (activate) {
        await exec('/usr/bin/systemctl', ['daemon-reload'], { encoding: 'utf8', timeout: 30_000 })
        await exec('/usr/bin/systemctl', [
          'enable',
          '--now',
          'kryv-teal-production-observation.timer',
        ], { encoding: 'utf8', timeout: 30_000 })
      }
    } catch (error) {
      await restoreGeneration(selector, previousGeneration, requiredOwnerUid)
      if (activate) {
        await exec('/usr/bin/systemctl', ['daemon-reload'], { encoding: 'utf8', timeout: 30_000 })
      }
      throw error
    }
    return {
      archiveSha256,
      controllerPath,
      generationRoot,
      publicKeyFingerprint: key.fingerprint,
    }
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}

function commandArguments(args) {
  const values = new Map()
  let activate = false
  for (let index = 0; index < args.length;) {
    const name = args[index]
    if (name === '--activate') {
      if (activate) throw new Error('Installer arguments are invalid')
      activate = true
      index += 1
      continue
    }
    const value = args[index + 1]
    if (
      !['--archive', '--archive-sha256', '--owner-public-key', '--target-root'].includes(name)
      || !value
      || values.has(name)
    ) {
      throw new Error('Installer arguments are invalid')
    }
    values.set(name, value)
    index += 2
  }
  if (values.size !== 4) throw new Error('Installer arguments are incomplete')
  return { activate, values }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { activate, values } = commandArguments(process.argv.slice(2))
    if (activate && process.env.KRYV_TEAL_INSTALLER_LOCKED !== '1') {
      const script = fileURLToPath(import.meta.url)
      const locked = await exec('/usr/bin/flock', [
        '--exclusive',
        '/run/lock/kryv-teal-production.lock',
        '/usr/bin/env',
        'KRYV_TEAL_INSTALLER_LOCKED=1',
        '/usr/bin/node',
        script,
        ...process.argv.slice(2),
      ], {
        encoding: 'utf8',
        env: { PATH: '/usr/bin:/bin', LANG: 'C.UTF-8' },
        maxBuffer: 1024 * 1024,
        timeout: 300_000,
      })
      process.stdout.write(locked.stdout)
      process.stderr.write(locked.stderr)
      process.exit(0)
    }
    const ownerPublicKeyPem = await stableFile(values.get('--owner-public-key'), 64 * 1024)
    const result = await installProductionController({
      activate,
      archive: values.get('--archive'),
      archiveSha256: values.get('--archive-sha256'),
      ownerPublicKeyPem,
      requiredOwnerUid: 0,
      targetRoot: values.get('--target-root'),
    })
    process.stdout.write(`Installed fixed production controller ${result.archiveSha256}\n`)
  } catch (error) {
    process.stderr.write(`Controller installation failed: ${error.message}\n`)
    process.exitCode = 1
  }
}
