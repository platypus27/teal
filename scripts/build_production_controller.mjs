import { execFile } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import { constants, createReadStream } from 'node:fs'
import {
  lstat,
  mkdir,
  mkdtemp,
  open,
  realpath,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const TAR_EXECUTABLE = '/usr/bin/tar'
const MAX_SOURCE_BYTES = 8 * 1024 * 1024
const SOURCE_FILES = new Map([
  ['infra/sudoers.d/kryv-teal-production-controller', 'config/kryv-teal-production-controller.sudoers'],
  ['infra/systemd/kryv-teal-production-observation.service', 'config/kryv-teal-production-observation.service'],
  ['infra/systemd/kryv-teal-production-observation.timer', 'config/kryv-teal-production-observation.timer'],
  ['infra/release-owner-approval.json', 'config/release-owner-approval.json'],
  ['scripts/assemble-release-candidate.mjs', 'lib/assemble-release-candidate.mjs'],
  ['scripts/docker-archive.mjs', 'lib/docker-archive.mjs'],
  ['scripts/kryv_teal_production_controller.mjs', 'lib/kryv_teal_production_controller.mjs'],
  ['scripts/owner-approval.mjs', 'lib/owner-approval.mjs'],
  ['scripts/teal_owner_authority.mjs', 'lib/teal_owner_authority.mjs'],
  ['scripts/teal_release_candidate.mjs', 'lib/teal_release_candidate.mjs'],
])

function sameFileSnapshot(before, after) {
  return before.dev === after.dev
    && before.ino === after.ino
    && before.mode === after.mode
    && before.nlink === after.nlink
    && before.size === after.size
    && before.mtimeNs === after.mtimeNs
    && before.ctimeNs === after.ctimeNs
}

async function readStableFile(file, metadata, maximumBytes, label) {
  const expectedBytes = Number(metadata.size)
  const bytes = Buffer.allocUnsafe(expectedBytes)
  let offset = 0
  while (offset < expectedBytes) {
    const result = await file.read(bytes, offset, expectedBytes - offset, null)
    if (result.bytesRead === 0) break
    offset += result.bytesRead
  }
  const overflow = await file.read(Buffer.allocUnsafe(1), 0, 1, null)
  const finalMetadata = await file.stat({ bigint: true })
  if (
    offset !== expectedBytes
    || overflow.bytesRead !== 0
    || expectedBytes > maximumBytes
    || !sameFileSnapshot(metadata, finalMetadata)
  ) {
    throw new Error(`${label} changed while it was read`)
  }
  return bytes
}

async function descriptorPath(file, absolute) {
  if (process.platform === 'linux') return realpath(`/proc/self/fd/${file.fd}`)
  return realpath(absolute)
}

async function canonicalSourceFile(path) {
  const absolute = resolve(path)
  const source = await open(absolute, constants.O_RDONLY | constants.O_NOFOLLOW)
  try {
    const metadata = await source.stat({ bigint: true })
    if (
      !metadata.isFile()
      || metadata.isSymbolicLink()
      || metadata.size < 1n
      || metadata.size > BigInt(MAX_SOURCE_BYTES)
      || await descriptorPath(source, absolute) !== absolute
    ) {
      throw new Error(`Controller source must be a bounded canonical regular file: ${path}`)
    }
    return {
      absolute,
      bytes: await readStableFile(source, metadata, MAX_SOURCE_BYTES, 'Controller source'),
    }
  } finally {
    await source.close()
  }
}

function sha256Bytes(bytes) {
  return `sha256:${createHash('sha256').update(bytes).digest('hex')}`
}

async function sha256File(path) {
  const hash = createHash('sha256')
  await new Promise((resolveHash, reject) => {
    const stream = createReadStream(path)
    stream.on('error', reject)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', resolveHash)
  })
  return `sha256:${hash.digest('hex')}`
}

export async function buildProductionController({ output, workspaceRoot }) {
  const root = resolve(workspaceRoot)
  const outputPath = resolve(output)
  const outputParent = dirname(outputPath)
  await mkdir(outputParent, { recursive: true, mode: 0o700 })
  try {
    await lstat(outputPath)
    throw new Error('Controller archive output already exists')
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }

  const staging = await mkdtemp(join(outputParent, '.teal-controller-stage-'))
  const pending = join(
    outputParent,
    `.${outputPath.split('/').at(-1)}.pending-${process.pid}-${randomBytes(8).toString('hex')}`,
  )
  try {
    const files = []
    for (const [source, path] of SOURCE_FILES) {
      const input = await canonicalSourceFile(join(root, source))
      const destination = join(staging, path)
      await mkdir(dirname(destination), { recursive: true, mode: 0o700 })
      await writeFile(destination, input.bytes, { flag: 'wx', mode: 0o600 })
      files.push({
        path,
        bytes: input.bytes.length,
        sha256: sha256Bytes(input.bytes),
      })
    }
    files.sort((left, right) => left.path.localeCompare(right.path))
    const manifest = {
      schemaVersion: 1,
      requiredNodeVersion: '24.19.0',
      files,
    }
    await writeFile(
      join(staging, 'controller-manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
      { flag: 'wx', mode: 0o600 },
    )
    const archivePaths = ['controller-manifest.json', ...files.map(({ path }) => path)]
    await exec(TAR_EXECUTABLE, [
      '--create',
      '--file',
      pending,
      '--format=ustar',
      '--mtime=@0',
      '--owner=0',
      '--group=0',
      '--numeric-owner',
      '--mode=u=rw,go=',
      '--directory',
      staging,
      ...archivePaths,
    ], {
      encoding: 'utf8',
      env: { PATH: '/usr/bin:/bin', LANG: 'C.UTF-8' },
      maxBuffer: 1024 * 1024,
      timeout: 30_000,
    })
    const archiveSha256 = await sha256File(pending)
    const handle = await open(pending, 'r')
    try {
      await handle.sync()
    } finally {
      await handle.close()
    }
    await rename(pending, outputPath)
    const parent = await open(outputParent, 'r')
    try {
      await parent.sync()
    } finally {
      await parent.close()
    }
    return { archiveSha256, files }
  } finally {
    await rm(staging, { recursive: true, force: true })
    await rm(pending, { force: true })
  }
}
function outputArgument(args) {
  if (args.length !== 2 || args[0] !== '--output' || !args[1] || args[1].startsWith('-')) {
    throw new Error('Usage: build_production_controller.mjs --output <archive.tar>')
  }
  return args[1]
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await buildProductionController({
      output: outputArgument(process.argv.slice(2)),
      workspaceRoot: resolve(import.meta.dirname, '..'),
    })
    process.stdout.write(`Built fixed production controller ${result.archiveSha256}\n`)
  } catch (error) {
    process.stderr.write(`Controller build failed: ${error.message}\n`)
    process.exitCode = 1
  }
}
