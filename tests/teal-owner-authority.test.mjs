import assert from 'node:assert/strict'
import { generateKeyPairSync, sign } from 'node:crypto'
import { constants } from 'node:fs'
import { chmod, mkdir, mkdtemp, open, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import {
  APPROVAL_CONTEXT,
  approvalDigest,
  approvalPublicKey,
  canonicalApprovalManifest,
} from '../scripts/owner-approval.mjs'
import { authorizeAndConsumeOwnerApproval } from '../scripts/teal_owner_authority.mjs'

const { privateKey, publicKey } = generateKeyPairSync('ed25519')
const publicKeyPem = publicKey.export({ format: 'pem', type: 'spki' })
const fingerprint = approvalPublicKey(publicKeyPem).fingerprint
const expectedContext = {
  candidateSha256: `sha256:${'a'.repeat(64)}`,
  environment: 'teal-production',
  ref: 'refs/heads/master',
  repository: 'platypus27/teal',
  sourceCommit: '1'.repeat(40),
  sourceRunAttempt: 2,
  sourceRunId: '1234567890123456789',
  workflow: 'platypus27/teal/.github/workflows/protected-release.yml',
}

function approvalFixture() {
  const manifest = {
    schemaVersion: 3,
    decision: 'approve',
    owner: 'kryv-owner',
    operation: 'docs-deploy',
    mutations: ['registry-push', 'production-deploy'],
    approvalReference: 'owner-record-2026-08-07',
    nonce: Buffer.alloc(32, 7).toString('base64'),
    createdAt: '2026-08-07T11:55:00.000Z',
    expiresAt: '2026-08-07T12:10:00.000Z',
    ...expectedContext,
    artifact: {
      imageId: `sha256:${'2'.repeat(64)}`,
      archiveSha256: `sha256:${'3'.repeat(64)}`,
      repository: 'ghcr.io/platypus27/teal/teal-docs',
    },
  }
  const manifestBytes = canonicalApprovalManifest(manifest)
  const digest = approvalDigest(manifestBytes)
  return {
    descriptor: { ...manifest.artifact, sourceCommit: manifest.sourceCommit },
    digest,
    manifest,
    manifestBytes,
    signature: sign(
      null,
      Buffer.from(`${APPROVAL_CONTEXT}${digest}\n`),
      privateKey,
    ).toString('base64'),
  }
}

async function ledgerFixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'teal-owner-ledger-'))
  const ledgerRoot = join(root, 'consumed-approvals')
  await mkdir(ledgerRoot, { mode: 0o700 })
  t.after(() => rm(root, { recursive: true, force: true }))
  return ledgerRoot
}

test('verifies and durably consumes one exact docs approval before mutation', async (t) => {
  const ledgerRoot = await ledgerFixture(t)
  const approval = approvalFixture()
  const authorize = () => authorizeAndConsumeOwnerApproval({
    ...approval,
    clock: () => new Date('2026-08-07T12:00:00.000Z'),
    expectedContext,
    ledgerRoot,
    publicKeyPem,
    requiredOwnerUid: process.getuid(),
    trustedFingerprint: fingerprint,
  })
  const result = await authorize()
  const path = join(ledgerRoot, `${approval.digest.slice('sha256:'.length)}.json`)
  const recordFile = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW)
  let metadata
  let record
  try {
    metadata = await recordFile.stat()
    record = JSON.parse(await recordFile.readFile('utf8'))
  } finally {
    await recordFile.close()
  }

  assert.equal(metadata.mode & 0o777, 0o600)
  assert.equal(result.digest, approval.digest)
  assert.equal(record.approvalDigest, approval.digest)
  assert.equal(record.operation, 'docs-deploy')
  assert.equal(record.candidateSha256, expectedContext.candidateSha256)
  assert.equal(record.sourceRunId, expectedContext.sourceRunId)
  await assert.rejects(authorize(), /already consumed|replay/i)
})

test('rechecks expiry immediately before durable consumption', async (t) => {
  const ledgerRoot = await ledgerFixture(t)
  const approval = approvalFixture()
  const times = [
    new Date('2026-08-07T12:00:00.000Z'),
    new Date('2026-08-07T12:10:00.001Z'),
  ]
  await assert.rejects(
    authorizeAndConsumeOwnerApproval({
      ...approval,
      clock: () => times.shift(),
      expectedContext,
      ledgerRoot,
      publicKeyPem,
      requiredOwnerUid: process.getuid(),
      trustedFingerprint: fingerprint,
    }),
    /validity window/i,
  )
  assert.deepEqual(await readFile(join(ledgerRoot, '.keep')).catch(() => undefined), undefined)
})

test('rejects a replay ledger with permissive mode or the wrong owner', async (t) => {
  const ledgerRoot = await ledgerFixture(t)
  const approval = approvalFixture()
  await chmod(ledgerRoot, 0o755)
  await assert.rejects(
    authorizeAndConsumeOwnerApproval({
      ...approval,
      clock: () => new Date('2026-08-07T12:00:00.000Z'),
      expectedContext,
      ledgerRoot,
      publicKeyPem,
      requiredOwnerUid: process.getuid(),
      trustedFingerprint: fingerprint,
    }),
    /mode|ledger/i,
  )
})
