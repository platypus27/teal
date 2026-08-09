import { execFile } from 'node:child_process'
import {
  copyFile,
  lstat,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  realpath,
  rm,
  writeFile,
} from 'node:fs/promises'
import { basename, dirname, isAbsolute, join, posix, relative, resolve } from 'node:path'
import { promisify } from 'node:util'

import { assertPackedFiles, sha512Integrity } from './package-contract.mjs'

const exec = promisify(execFile)

async function run(command, args, cwd) {
  return exec(command, args, {
    cwd,
    env: process.env,
    maxBuffer: 20 * 1024 * 1024,
  })
}

async function listRegularFiles(root, relative = '') {
  const files = []
  const directory = join(root, relative)
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = relative ? `${relative}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      files.push(...await listRegularFiles(root, path))
    } else if (entry.isFile()) {
      files.push(path)
    } else {
      throw new Error(`Package build contains a non-regular file: ${path}`)
    }
  }
  return files.sort()
}

export async function createPackageArtifact({
  artifactDirectory,
  build = true,
  packageRoot,
  requireClean = false,
  workspaceRoot,
}) {
  const packageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'))
  await mkdir(artifactDirectory, { recursive: true })

  if (build) await run(process.execPath, [join(packageRoot, 'scripts/build.mjs')], packageRoot)
  const builtDistFiles = await listRegularFiles(packageRoot, 'dist')
  if (builtDistFiles.length === 0) throw new Error('Package build produced no dist files')

  const { stdout: sourceOutput } = await run('git', ['rev-parse', 'HEAD'], workspaceRoot)
  const sourceCommit = sourceOutput.trim()
  if (!/^[0-9a-f]{40}$/.test(sourceCommit)) throw new Error('git did not return a full source commit')
  if (requireClean) {
    const { stdout: status } = await run('git', ['status', '--porcelain=v1', '--untracked-files=all'], workspaceRoot)
    if (status.trim()) throw new Error('Release checkout must be clean before creating a release artifact')
  }

  const { stdout: dryRunOutput } = await run('npm', [
    'pack',
    '--dry-run',
    '--ignore-scripts',
    '--json',
    '--workspace',
    packageJson.name,
  ], workspaceRoot)
  const dryRunManifests = JSON.parse(dryRunOutput)
  if (!Array.isArray(dryRunManifests) || dryRunManifests.length !== 1) {
    throw new Error(`Expected one npm pack manifest, received ${Array.isArray(dryRunManifests) ? dryRunManifests.length : 'invalid JSON'}`)
  }
  const dryRunManifest = dryRunManifests[0]
  if (!Array.isArray(dryRunManifest.files) || dryRunManifest.files.length === 0) {
    throw new Error('npm pack returned an empty file manifest')
  }
  assertPackedFiles({
    packageJson,
    packedFiles: dryRunManifest.files.map((file) => file.path),
    builtDistFiles,
  })

  if (dryRunManifest.files.length > 10_000) {
    throw new Error('npm pack returned too many files')
  }
  const stagingRoot = await mkdtemp(join(resolve(artifactDirectory), '.package-staging-'))
  let totalBytes = 0
  let manifest
  try {
    const packageRootReal = await realpath(packageRoot)
    for (const file of dryRunManifest.files) {
      const path = file?.path
      if (
        typeof path !== 'string'
        || path.length === 0
        || path.includes('\\')
        || path.includes('\0')
        || isAbsolute(path)
        || posix.normalize(path) !== path
        || path.split('/').some((segment) => !segment || segment === '.' || segment === '..')
      ) {
        throw new Error(`npm pack returned an unsafe file path: ${String(path)}`)
      }
      if (path === 'package.json') continue
      const source = join(packageRoot, path)
      const sourceReal = await realpath(source)
      const sourceRelative = relative(packageRootReal, sourceReal)
      const metadata = await lstat(source)
      if (
        !metadata.isFile()
        || metadata.isSymbolicLink()
        || sourceRelative.startsWith('..')
        || isAbsolute(sourceRelative)
      ) {
        throw new Error(`Package source is not a confined regular file: ${path}`)
      }
      totalBytes += metadata.size
      if (totalBytes > 100 * 1024 * 1024) {
        throw new Error('Package source exceeds the bounded staging size')
      }
      const destination = join(stagingRoot, path)
      await mkdir(dirname(destination), { recursive: true })
      await copyFile(source, destination)
    }
    await writeFile(
      join(stagingRoot, 'package.json'),
      `${JSON.stringify({ ...packageJson, gitHead: sourceCommit }, null, 2)}\n`,
      { flag: 'wx', mode: 0o600 },
    )

    const { stdout } = await run('npm', [
      'pack',
      '--ignore-scripts',
      '--json',
      '--pack-destination',
      resolve(artifactDirectory),
      stagingRoot,
    ], workspaceRoot)
    const manifests = JSON.parse(stdout)
    if (!Array.isArray(manifests) || manifests.length !== 1) {
      throw new Error(`Expected one npm pack manifest, received ${Array.isArray(manifests) ? manifests.length : 'invalid JSON'}`)
    }
    manifest = manifests[0]
    if (typeof manifest.filename !== 'string' || basename(manifest.filename) !== manifest.filename) {
      throw new Error('npm pack returned an unsafe tarball filename')
    }
    assertPackedFiles({
      packageJson,
      packedFiles: manifest.files.map((file) => file.path),
      builtDistFiles,
    })
  } finally {
    await rm(stagingRoot, { recursive: true, force: true })
  }

  const tarballPath = resolve(artifactDirectory, manifest.filename)
  return {
    builtDistFiles,
    integrity: await sha512Integrity(tarballPath),
    manifest,
    name: manifest.name,
    sourceCommit,
    tarballPath,
    version: manifest.version,
  }
}
