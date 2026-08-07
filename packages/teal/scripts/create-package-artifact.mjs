import { execFile } from 'node:child_process'
import { mkdir, readdir, readFile } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'
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

  const { stdout } = await run('npm', [
    'pack',
    '--ignore-scripts',
    '--json',
    '--workspace',
    packageJson.name,
    '--pack-destination',
    resolve(artifactDirectory),
  ], workspaceRoot)
  const manifests = JSON.parse(stdout)
  if (!Array.isArray(manifests) || manifests.length !== 1) {
    throw new Error(`Expected one npm pack manifest, received ${Array.isArray(manifests) ? manifests.length : 'invalid JSON'}`)
  }
  const manifest = manifests[0]
  if (typeof manifest.filename !== 'string' || basename(manifest.filename) !== manifest.filename) {
    throw new Error('npm pack returned an unsafe tarball filename')
  }
  assertPackedFiles({
    packageJson,
    packedFiles: manifest.files.map((file) => file.path),
    builtDistFiles,
  })

  const { stdout: sourceOutput } = await run('git', ['rev-parse', 'HEAD'], workspaceRoot)
  const sourceCommit = sourceOutput.trim()
  if (!/^[0-9a-f]{40}$/.test(sourceCommit)) throw new Error('git did not return a full source commit')
  if (requireClean) {
    const { stdout: status } = await run('git', ['status', '--porcelain=v1', '--untracked-files=no'], workspaceRoot)
    if (status.trim()) throw new Error('Tracked checkout must be clean before creating a release artifact')
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
