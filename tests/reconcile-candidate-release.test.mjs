import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { reconcileCandidateRelease } from '../scripts/reconcile-candidate-release.mjs'

const artifact = {
  name: '@kryv/teal',
  version: '0.5.1',
  sourceCommit: '1'.repeat(40),
  integrity: `sha512-${Buffer.alloc(64, 7).toString('base64')}`,
}

test('reconciles only the exact candidate source tag and release idempotently', async () => {
  let tagCommit
  let release
  const calls = []
  const adapter = {
    inspectTag: async () => tagCommit,
    createTag: async (candidate) => {
      calls.push(['tag', candidate.sourceCommit])
      tagCommit = candidate.sourceCommit
    },
    inspectRelease: async () => release,
    createRelease: async (candidate) => {
      calls.push(['release', candidate.version])
      release = {
        draft: false,
        prerelease: false,
        tag_name: `v${candidate.version}`,
        target_commitish: candidate.sourceCommit,
      }
    },
  }
  const result = await reconcileCandidateRelease(artifact, adapter)
  assert.deepEqual(calls, [
    ['tag', artifact.sourceCommit],
    ['release', artifact.version],
  ])
  assert.equal(result.tagCommit, artifact.sourceCommit)
  await reconcileCandidateRelease(artifact, adapter)
  assert.equal(calls.length, 2)
})

test('rejects conflicting tag or release state', async () => {
  await assert.rejects(
    reconcileCandidateRelease(artifact, {
      inspectTag: async () => '2'.repeat(40),
      inspectRelease: async () => undefined,
    }),
    /tag conflicts/i,
  )
  await assert.rejects(
    reconcileCandidateRelease(artifact, {
      inspectTag: async () => artifact.sourceCommit,
      inspectRelease: async () => ({
        draft: true,
        prerelease: false,
        tag_name: `v${artifact.version}`,
      }),
    }),
    /release conflicts/i,
  )
})

test('candidate reconciliation implementation never depends on a checkout', async () => {
  const source = await readFile(
    new URL('../scripts/reconcile-candidate-release.mjs', import.meta.url),
    'utf8',
  )
  assert.doesNotMatch(source, /git rev-parse|git status|actions\/checkout/)
  assert.match(source, /target_commitish/)
})
