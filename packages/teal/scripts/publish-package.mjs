import { createHash } from 'node:crypto'
import { execFile, spawn } from 'node:child_process'
import { lstat, readdir, readFile, realpath } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { list as listTar } from 'tar'

import { assertPackedFiles, assertSafeArchivePath, sha512Integrity } from './package-contract.mjs'

const validatedArtifact = Symbol('validated release artifact')
const exec = promisify(execFile)
const packageRoot = resolve(import.meta.dirname, '..')
const workspaceRoot = resolve(packageRoot, '../..')

function runCommand(command, args) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, {
      cwd: workspaceRoot,
      env: process.env,
      stdio: 'inherit',
    })
    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (code === 0) resolveRun()
      else reject(new Error(`${command} exited with ${signal ? `signal ${signal}` : `code ${code}`}`))
    })
  })
}

async function readArchiveEntries(tarballPath) {
  const entries = new Map()
  const seen = new Set()
  const pending = []
  let validationError

  await listTar({
    file: tarballPath,
    noResume: true,
    strict: true,
    onReadEntry(entry) {
      let path
      try {
        path = assertSafeArchivePath(entry.path, seen)
        if (entry.type === 'SymbolicLink' || entry.type === 'Link') {
          throw new Error(`${entry.type === 'SymbolicLink' ? 'Symbolic link' : 'Hard link'} entry is forbidden: ${path}`)
        }
        if (!['File', 'OldFile', 'Directory'].includes(entry.type)) {
          throw new Error(`Unsupported archive entry type ${entry.type}: ${path}`)
        }
      } catch (error) {
        validationError ??= error
        entry.resume()
        return
      }
      const chunks = []
      pending.push(new Promise((resolve, reject) => {
        entry.on('data', (chunk) => chunks.push(chunk))
        entry.on('error', reject)
        entry.on('end', () => {
          entries.set(path, { body: Buffer.concat(chunks), type: entry.type })
          resolve()
        })
        entry.resume()
      }))
    },
  })
  await Promise.all(pending)
  if (validationError) throw validationError
  return entries
}

async function readRegularFiles(root, relative = '') {
  const files = new Map()
  const directory = join(root, relative)
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = relative ? `${relative}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      for (const [nestedPath, body] of await readRegularFiles(root, path)) files.set(nestedPath, body)
    } else if (entry.isFile()) {
      files.set(path, await readFile(join(root, path)))
    } else {
      throw new Error(`Current dist contains a non-regular file: ${path}`)
    }
  }
  return files
}

function sha256(body) {
  return createHash('sha256').update(body).digest('hex')
}

export async function validateReleaseArtifact({ artifactDirectory, currentPackageJson, currentSourceCommit, descriptor, packageRoot }) {
  const artifactRoot = await realpath(artifactDirectory)
  const tarballStat = await lstat(descriptor.tarballPath)
  const tarballPath = await realpath(descriptor.tarballPath)
  const tarballRelative = relative(artifactRoot, tarballPath)
  if (
    !tarballStat.isFile() ||
    tarballStat.isSymbolicLink() ||
    tarballRelative === '' ||
    tarballRelative.startsWith('..') ||
    isAbsolute(tarballRelative)
  ) {
    throw new Error('Tarball path must be a regular file inside the artifact directory')
  }
  const integrity = await sha512Integrity(descriptor.tarballPath)
  if (integrity !== descriptor.integrity) {
    throw new Error('Artifact integrity mismatch')
  }
  if (
    !/^[0-9a-f]{40}$/.test(descriptor.sourceCommit) ||
    !/^[0-9a-f]{40}$/.test(currentSourceCommit) ||
    descriptor.sourceCommit !== currentSourceCommit
  ) {
    throw new Error('Source commit mismatch')
  }
  const entries = await readArchiveEntries(descriptor.tarballPath)
  const archivedPackageEntry = entries.get('package/package.json')
  if (!archivedPackageEntry) throw new Error('Exact tarball is missing package/package.json')
  const archivedPackageJson = JSON.parse(archivedPackageEntry.body.toString('utf8'))
  if (archivedPackageJson.name !== currentPackageJson.name) {
    throw new Error('Archive package name mismatch')
  }
  if (archivedPackageJson.version !== currentPackageJson.version) {
    throw new Error('Archive package version mismatch')
  }

  const archiveFiles = [...entries]
    .filter(([, entry]) => entry.type === 'File' || entry.type === 'OldFile')
    .map(([path, entry]) => [path.slice('package/'.length), entry.body])
  const currentDist = await readRegularFiles(packageRoot, 'dist')
  assertPackedFiles({
    packageJson: archivedPackageJson,
    packedFiles: archiveFiles.map(([path]) => path),
    builtDistFiles: [...currentDist.keys()],
  })
  const archiveDist = new Map(archiveFiles.filter(([path]) => path.startsWith('dist/')))
  const archivePaths = [...archiveDist.keys()].sort()
  const currentPaths = [...currentDist.keys()].sort()
  if (JSON.stringify(archivePaths) !== JSON.stringify(currentPaths)) {
    throw new Error(`Dist file set mismatch: archive=${archivePaths.join(', ')} current=${currentPaths.join(', ')}`)
  }
  for (const path of currentPaths) {
    if (sha256(archiveDist.get(path)) !== sha256(currentDist.get(path))) {
      throw new Error(`Dist byte mismatch: ${path}`)
    }
  }
  return { ...descriptor, archivedPackageJson, [validatedArtifact]: true }
}

export async function publishValidatedArtifact(
  artifact,
  run = runCommand,
  announce = (message) => process.stdout.write(message),
) {
  if (artifact?.[validatedArtifact] !== true) {
    throw new Error('Release artifact was not validated')
  }
  await run('npm', [
    'publish',
    artifact.tarballPath,
    '--access',
    'public',
    '--provenance',
  ])
  announce(
    `New tag: ${artifact.archivedPackageJson.name}@${artifact.archivedPackageJson.version}\n`,
  )
}

async function main() {
  const descriptorArgument = process.argv[2] ?? '.release/npm/artifact.json'
  if (process.argv.length > 3 || descriptorArgument.startsWith('-')) {
    throw new Error('Usage: node publish-package.mjs [artifact.json]')
  }
  const descriptorPath = resolve(workspaceRoot, descriptorArgument)
  const artifactDirectory = dirname(descriptorPath)
  const descriptor = JSON.parse(await readFile(descriptorPath, 'utf8'))
  const currentPackageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'))

  await runCommand(process.execPath, [join(packageRoot, 'scripts/build.mjs')])
  const { stdout: sourceOutput } = await exec('git', ['rev-parse', 'HEAD'], { cwd: workspaceRoot, env: process.env })
  const currentSourceCommit = sourceOutput.trim()
  const { stdout: status } = await exec('git', ['status', '--porcelain=v1', '--untracked-files=no'], {
    cwd: workspaceRoot,
    env: process.env,
  })
  if (status.trim()) throw new Error('Tracked checkout must be clean before publishing')

  const artifact = await validateReleaseArtifact({
    artifactDirectory,
    currentPackageJson,
    currentSourceCommit,
    descriptor,
    packageRoot,
  })
  await publishValidatedArtifact(artifact)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
