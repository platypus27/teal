import assert from 'node:assert/strict'
import test from 'node:test'

import {
  decideReleaseMode,
  reconcileGitHubRelease,
} from '../scripts/release-state.mjs'

const artifact = {
  integrity: `sha512-${Buffer.alloc(64, 7).toString('base64')}`,
  name: '@kryv/teal',
  sourceCommit: '1'.repeat(40),
  version: '0.5.1',
}

function published(overrides = {}) {
  return {
    name: artifact.name,
    version: artifact.version,
    gitHead: artifact.sourceCommit,
    dist: {
      integrity: artifact.integrity,
      attestations: {
        url: `https://registry.npmjs.org/-/npm/v1/attestations/@kryv%2fteal@${artifact.version}`,
        provenance: { predicateType: 'https://slsa.dev/provenance/v1' },
      },
    },
    ...overrides,
  }
}

test('plans Changesets versioning before considering registry state', () => {
  assert.equal(decideReleaseMode({ artifact, hasChangesets: true }), 'version')
})

test('plans publication when the exact package version is absent', () => {
  assert.equal(decideReleaseMode({ artifact, hasChangesets: false }), 'publish')
})

test('plans reconciliation after npm succeeds but the exact tag or release is absent', () => {
  assert.equal(decideReleaseMode({
    artifact,
    hasChangesets: false,
    registry: published(),
  }), 'reconcile')
  assert.equal(decideReleaseMode({
    artifact,
    hasChangesets: false,
    registry: published(),
    tagCommit: artifact.sourceCommit,
  }), 'reconcile')
})

test('selects none only when registry bytes, provenance, tag, and release are exact', () => {
  assert.equal(decideReleaseMode({
    artifact,
    hasChangesets: false,
    registry: published(),
    release: { draft: false, prerelease: false, tag_name: `v${artifact.version}` },
    tagCommit: artifact.sourceCommit,
  }), 'none')
})

test('rejects an out-of-band registry artifact instead of treating the version as complete', () => {
  for (const registry of [
    published({ gitHead: '2'.repeat(40) }),
    published({ dist: { ...published().dist, integrity: 'sha512-wrong' } }),
    published({ dist: { integrity: artifact.integrity } }),
    published({
      dist: {
        ...published().dist,
        attestations: {
          ...published().dist.attestations,
          url: `https://example.com/-/npm/v1/attestations/@kryv%2fteal@${artifact.version}`,
        },
      },
    }),
  ]) {
    assert.throws(
      () => decideReleaseMode({ artifact, hasChangesets: false, registry }),
      /published registry version conflicts with reviewed artifact/i,
    )
  }
})

test('rejects a tag or release that conflicts with the reviewed commit and version', () => {
  assert.throws(
    () => decideReleaseMode({
      artifact,
      hasChangesets: false,
      registry: published(),
      tagCommit: '3'.repeat(40),
    }),
    /tag conflicts/i,
  )
  assert.throws(
    () => decideReleaseMode({
      artifact,
      hasChangesets: false,
      registry: published(),
      release: { draft: false, prerelease: false, tag_name: 'v0.5.0' },
      tagCommit: artifact.sourceCommit,
    }),
    /release conflicts/i,
  )
})

test('idempotently creates only missing exact GitHub tag and release state', async () => {
  let tagCommit
  let release
  const calls = []
  const result = await reconcileGitHubRelease(artifact, {
    createRelease: async (candidate) => {
      calls.push(['release', candidate])
      release = { draft: false, prerelease: false, tag_name: `v${artifact.version}` }
    },
    createTag: async (candidate) => {
      calls.push(['tag', candidate])
      tagCommit = artifact.sourceCommit
    },
    inspectRelease: async () => release,
    inspectTag: async () => tagCommit,
  })

  assert.deepEqual(calls, [
    ['tag', artifact],
    ['release', artifact],
  ])
  assert.deepEqual(result, { release, tagCommit: artifact.sourceCommit })

  calls.length = 0
  await reconcileGitHubRelease(artifact, {
    createRelease: async () => calls.push(['release']),
    createTag: async () => calls.push(['tag']),
    inspectRelease: async () => release,
    inspectTag: async () => tagCommit,
  })
  assert.deepEqual(calls, [])
})

test('GitHub reconciliation fails closed on a conflicting tag', async () => {
  await assert.rejects(
    reconcileGitHubRelease(artifact, {
      createRelease: async () => assert.fail('must not create release'),
      createTag: async () => assert.fail('must not rewrite tag'),
      inspectRelease: async () => undefined,
      inspectTag: async () => '4'.repeat(40),
    }),
    /tag conflicts/i,
  )
})
