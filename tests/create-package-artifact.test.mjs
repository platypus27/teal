import assert from 'node:assert/strict'
import { access, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

import { createPackageArtifact } from '../packages/teal/scripts/create-package-artifact.mjs'

const workspaceRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const packageRoot = join(workspaceRoot, 'packages/teal')

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
  assert.match(artifact.sourceCommit, /^[0-9a-f]{40}$/)
  assert.equal(artifact.name, '@kryv/teal')
  assert.equal(artifact.version, '0.4.1')
  assert.ok(artifact.manifest.files.some((file) => file.path === 'dist/index.js'))
  assert.ok(artifact.builtDistFiles.includes('dist/index.js'))
})
