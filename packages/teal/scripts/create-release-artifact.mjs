import { mkdir, rm, writeFile } from 'node:fs/promises'
import { isAbsolute, posix, resolve } from 'node:path'

import { createPackageArtifact } from './create-package-artifact.mjs'

const packageRoot = resolve(import.meta.dirname, '..')
const workspaceRoot = resolve(packageRoot, '../..')

function artifactPath(args) {
  if (args.length !== 2 || args[0] !== '--artifact-directory') {
    throw new Error('Usage: create-release-artifact.mjs --artifact-directory .release/<directory>')
  }
  const path = args[1]
  if (
    !path.startsWith('.release/')
    || isAbsolute(path)
    || posix.normalize(path) !== path
    || path.split('/').some((segment) => !segment || segment === '.' || segment === '..')
  ) {
    throw new Error('Release artifact directory must be confined beneath .release')
  }
  return resolve(workspaceRoot, path)
}

try {
  const directory = artifactPath(process.argv.slice(2))
  await rm(directory, { recursive: true, force: true })
  await mkdir(directory, { recursive: true, mode: 0o700 })
  const artifact = await createPackageArtifact({
    artifactDirectory: directory,
    build: true,
    packageRoot,
    requireClean: true,
    workspaceRoot,
  })
  await writeFile(resolve(directory, 'artifact.json'), `${JSON.stringify({
    integrity: artifact.integrity,
    name: artifact.name,
    sourceCommit: artifact.sourceCommit,
    tarballPath: artifact.tarballPath,
    version: artifact.version,
  }, null, 2)}\n`, { flag: 'wx', mode: 0o600 })
  process.stdout.write(`Retained ${artifact.name}@${artifact.version} at ${artifact.integrity}\n`)
} catch (error) {
  process.stderr.write(`Release artifact creation failed: ${error.message}\n`)
  process.exitCode = 1
}
