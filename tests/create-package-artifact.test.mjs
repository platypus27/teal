import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { list as listTar } from 'tar'
import { promisify } from 'node:util'

import { createPackageArtifact } from '../packages/teal/scripts/create-package-artifact.mjs'

const workspaceRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const packageRoot = join(workspaceRoot, 'packages/teal')
const execute = promisify(execFile)

test('builds and retains one validated npm tarball', async (t) => {
  const artifactDirectory = await mkdtemp(join(tmpdir(), 'teal-created-artifact-'))
  t.after(() => rm(artifactDirectory, { recursive: true, force: true }))

  const artifact = await createPackageArtifact({
    artifactDirectory,
    build: true,
    packageRoot,
    workspaceRoot,
  })

  await access(artifact.tarballPath)
  const packageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'))
  assert.match(artifact.sourceCommit, /^[0-9a-f]{40}$/)
  assert.equal(artifact.name, '@kryv/teal')
  assert.equal(artifact.version, packageJson.version)
  assert.ok(artifact.manifest.files.some((file) => file.path === 'dist/index.js'))
  assert.ok(artifact.builtDistFiles.includes('dist/index.js'))

  let archivedPackageJson
  await listTar({
    file: artifact.tarballPath,
    onReadEntry(entry) {
      if (entry.path !== 'package/package.json') {
        entry.resume()
        return
      }
      const chunks = []
      entry.on('data', (chunk) => chunks.push(chunk))
      entry.on('end', () => {
        archivedPackageJson = JSON.parse(Buffer.concat(chunks).toString('utf8'))
      })
    },
  })
  assert.equal(archivedPackageJson.gitHead, artifact.sourceCommit)
})

test('rejects nonignored untracked package source before assigning the HEAD identity', async (t) => {
  const repositoryRoot = await mkdtemp(join(tmpdir(), 'teal-untracked-release-'))
  const artifactDirectory = await mkdtemp(join(tmpdir(), 'teal-untracked-artifact-'))
  t.after(() => Promise.all([
    rm(repositoryRoot, { recursive: true, force: true }),
    rm(artifactDirectory, { recursive: true, force: true }),
  ]))
  const releasePackageRoot = join(repositoryRoot, 'packages/release-contract')
  await mkdir(join(releasePackageRoot, 'dist'), { recursive: true })
  await mkdir(join(releasePackageRoot, 'src'))
  await writeFile(join(repositoryRoot, 'package.json'), `${JSON.stringify({
    private: true,
    workspaces: ['packages/*'],
  }, null, 2)}\n`)
  await writeFile(join(releasePackageRoot, 'package.json'), `${JSON.stringify({
    name: '@example/release-contract',
    version: '1.0.0',
    files: ['dist', 'src'],
  }, null, 2)}\n`)
  await writeFile(join(releasePackageRoot, 'dist/index.js'), 'export {}\n')
  await writeFile(join(releasePackageRoot, 'src/index.ts'), 'export {}\n')
  await execute('git', ['init', '--quiet'], { cwd: repositoryRoot })
  await execute('git', ['config', 'user.email', 'release-contract@example.invalid'], { cwd: repositoryRoot })
  await execute('git', ['config', 'user.name', 'Release Contract'], { cwd: repositoryRoot })
  await execute('git', ['add', '.'], { cwd: repositoryRoot })
  await execute('git', ['commit', '--quiet', '-m', 'test: tracked package'], { cwd: repositoryRoot })
  await writeFile(join(releasePackageRoot, 'src/untracked.ts'), 'export const hidden = true\n')

  await assert.rejects(
    createPackageArtifact({
      artifactDirectory,
      build: false,
      packageRoot: releasePackageRoot,
      requireClean: true,
      workspaceRoot: repositoryRoot,
    }),
    /checkout must be clean/i,
  )
})
