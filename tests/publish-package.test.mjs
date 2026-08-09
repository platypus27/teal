import assert from 'node:assert/strict'
import { link, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { create as createTar } from 'tar'

import { sha512Integrity } from '../packages/teal/scripts/package-contract.mjs'
import {
  publishOrVerifyArtifact,
  publishValidatedArtifact,
  validateReleaseArtifact,
} from '../packages/teal/scripts/publish-package.mjs'

const packageJson = {
  name: '@kryv/teal',
  version: '0.4.1',
  main: './dist/index.js',
  module: './dist/index.js',
  types: './dist/index.d.ts',
  exports: { './styles.css': './dist/styles.css' },
}
const sourceCommit = '0123456789abcdef0123456789abcdef01234567'

async function artifactFixture(t, archivedPackageJson = { ...packageJson, gitHead: sourceCommit }) {
  const artifactDirectory = await mkdtemp(join(tmpdir(), 'teal-publish-contract-'))
  t.after(() => rm(artifactDirectory, { recursive: true, force: true }))
  const packageRoot = join(artifactDirectory, 'package')
  await mkdir(join(packageRoot, 'dist'), { recursive: true })
  await writeFile(join(packageRoot, 'package.json'), JSON.stringify(archivedPackageJson))
  await writeFile(join(packageRoot, 'dist/index.js'), 'export const teal = true\n')
  await writeFile(join(packageRoot, 'dist/index.d.ts'), 'export declare const teal: true\n')
  await writeFile(join(packageRoot, 'dist/styles.css'), ':root { --teal: 1; }\n')
  const tarballPath = join(artifactDirectory, 'kryv-teal-0.4.1.tgz')
  await createTar({ cwd: artifactDirectory, file: tarballPath, gzip: true }, ['package'])
  return {
    artifactDirectory,
    packageRoot,
    descriptor: {
      tarballPath,
      integrity: await sha512Integrity(tarballPath),
      sourceCommit,
    },
  }
}

test('rejects a retained artifact whose bytes changed', async (t) => {
  const fixture = await artifactFixture(t)
  await writeFile(fixture.descriptor.tarballPath, 'changed bytes')
  await assert.rejects(
    validateReleaseArtifact({ ...fixture, currentPackageJson: packageJson, currentSourceCommit: sourceCommit }),
    /artifact integrity mismatch/i,
  )
})

test('binds the retained artifact to the full source commit', async (t) => {
  const fixture = await artifactFixture(t)
  await assert.rejects(
    validateReleaseArtifact({
      ...fixture,
      descriptor: { ...fixture.descriptor, sourceCommit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
      currentPackageJson: packageJson,
      currentSourceCommit: sourceCommit,
    }),
    /source commit mismatch/i,
  )
})

test('derives package identity from the exact tarball', async (t) => {
  const fixture = await artifactFixture(t, { ...packageJson, version: '0.4.0', gitHead: sourceCommit })
  await assert.rejects(
    validateReleaseArtifact({
      ...fixture,
      currentPackageJson: packageJson,
      currentSourceCommit: sourceCommit,
    }),
    /archive package version mismatch/i,
  )
})

test('rejects an archive without the exact source gitHead', async (t) => {
  const fixture = await artifactFixture(t, packageJson)
  await assert.rejects(
    validateReleaseArtifact({
      ...fixture,
      currentPackageJson: packageJson,
      currentSourceCommit: sourceCommit,
    }),
    /archive gitHead mismatch/i,
  )
})

test('publishes only the validated retained tarball', async (t) => {
  const fixture = await artifactFixture(t)
  const validated = await validateReleaseArtifact({
    ...fixture,
    currentPackageJson: packageJson,
    currentSourceCommit: sourceCommit,
  })
  const calls = []
  const announcements = []
  await publishValidatedArtifact(validated, async (command, args) => {
    calls.push({ command, args })
  }, (message) => announcements.push(message))
  assert.deepEqual(calls, [{
    command: 'npm',
    args: ['publish', fixture.descriptor.tarballPath, '--access', 'public', '--provenance'],
  }])
  assert.deepEqual(announcements, ['New tag: @kryv/teal@0.4.1\n'])
})

test('publishes an absent version then requires exact registry integrity, gitHead, and provenance', async (t) => {
  const fixture = await artifactFixture(t)
  const validated = await validateReleaseArtifact({
    ...fixture,
    currentPackageJson: packageJson,
    currentSourceCommit: sourceCommit,
  })
  const calls = []
  let registry
  const result = await publishOrVerifyArtifact(validated, {
    inspect: async () => registry,
    publish: async (artifact) => {
      calls.push(artifact.tarballPath)
      registry = {
        name: packageJson.name,
        version: packageJson.version,
        gitHead: sourceCommit,
        dist: {
          integrity: fixture.descriptor.integrity,
          attestations: { url: 'https://registry.npmjs.org/-/npm/v1/attestations/example' },
        },
      }
    },
  })

  assert.deepEqual(calls, [fixture.descriptor.tarballPath])
  assert.deepEqual(result, { published: true, registry })
})

test('reconciles an exact already-published version without publishing again', async (t) => {
  const fixture = await artifactFixture(t)
  const validated = await validateReleaseArtifact({
    ...fixture,
    currentPackageJson: packageJson,
    currentSourceCommit: sourceCommit,
  })
  const registry = {
    name: packageJson.name,
    version: packageJson.version,
    gitHead: sourceCommit,
    dist: {
      integrity: fixture.descriptor.integrity,
      attestations: { url: 'https://registry.npmjs.org/-/npm/v1/attestations/example' },
    },
  }
  const result = await publishOrVerifyArtifact(validated, {
    inspect: async () => registry,
    publish: async () => assert.fail('exact published artifact must not be republished'),
  })

  assert.deepEqual(result, { published: false, registry })
})

test('fails closed when an existing registry version differs from the reviewed artifact', async (t) => {
  const fixture = await artifactFixture(t)
  const validated = await validateReleaseArtifact({
    ...fixture,
    currentPackageJson: packageJson,
    currentSourceCommit: sourceCommit,
  })

  await assert.rejects(
    publishOrVerifyArtifact(validated, {
      inspect: async () => ({
        name: packageJson.name,
        version: packageJson.version,
        gitHead: 'f'.repeat(40),
        dist: {
          integrity: fixture.descriptor.integrity,
          attestations: { url: 'https://registry.npmjs.org/-/npm/v1/attestations/example' },
        },
      }),
      publish: async () => assert.fail('conflicting version must not be overwritten'),
    }),
    /registry gitHead mismatch/i,
  )
})

test('rejects symlink ambiguity in the exact tarball', async (t) => {
  const fixture = await artifactFixture(t)
  await symlink('index.js', join(fixture.packageRoot, 'dist/linked.js'))
  await createTar({ cwd: fixture.artifactDirectory, file: fixture.descriptor.tarballPath, gzip: true }, ['package'])
  fixture.descriptor.integrity = await sha512Integrity(fixture.descriptor.tarballPath)
  await assert.rejects(
    validateReleaseArtifact({
      ...fixture,
      currentPackageJson: packageJson,
      currentSourceCommit: sourceCommit,
    }),
    /symbolic link|link entry/i,
  )
})

test('rejects stale archive dist bytes even when the tarball integrity is valid', async (t) => {
  const fixture = await artifactFixture(t)
  await writeFile(join(fixture.packageRoot, 'dist/index.js'), 'export const teal = false\n')

  await assert.rejects(
    validateReleaseArtifact({
      ...fixture,
      currentPackageJson: packageJson,
      currentSourceCommit: sourceCommit,
    }),
    /dist byte mismatch.*dist\/index\.js/i,
  )
})

test('rejects hard-link ambiguity in the exact tarball', async (t) => {
  const fixture = await artifactFixture(t)
  await link(join(fixture.packageRoot, 'dist/index.js'), join(fixture.packageRoot, 'dist/linked.js'))
  await createTar({ cwd: fixture.artifactDirectory, file: fixture.descriptor.tarballPath, gzip: true }, ['package'])
  fixture.descriptor.integrity = await sha512Integrity(fixture.descriptor.tarballPath)

  await assert.rejects(
    validateReleaseArtifact({
      ...fixture,
      currentPackageJson: packageJson,
      currentSourceCommit: sourceCommit,
    }),
    /hard link|link entry/i,
  )
})

test('rejects a descriptor that points outside its artifact directory', async (t) => {
  const fixture = await artifactFixture(t)
  const claimedArtifactDirectory = join(fixture.artifactDirectory, 'claimed')
  await mkdir(claimedArtifactDirectory)

  await assert.rejects(
    validateReleaseArtifact({
      ...fixture,
      artifactDirectory: claimedArtifactDirectory,
      currentPackageJson: packageJson,
      currentSourceCommit: sourceCommit,
    }),
    /tarball path.*artifact directory/i,
  )
})
