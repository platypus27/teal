import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { generateKeyPairSync, sign } from 'node:crypto'
import { mkdtemp, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import {
  APPROVAL_CONTEXT,
  assertApprovedArtifact,
  approvalDigest,
  approvalPublicKey,
  canonicalApprovalManifest,
  verifyOwnerApproval,
} from '../scripts/owner-approval.mjs'

const { privateKey, publicKey } = generateKeyPairSync('ed25519')
const publicKeyPem = publicKey.export({ format: 'pem', type: 'spki' })
const parsedKey = approvalPublicKey(publicKeyPem)
const now = new Date('2026-08-07T12:00:00.000Z')
const execute = promisify(execFile)
const verifier = fileURLToPath(new URL('../scripts/verify-owner-approval.mjs', import.meta.url))
const expectedContext = {
  candidateSha256: `sha256:${'a'.repeat(64)}`,
  environment: 'teal-release',
  ref: 'refs/heads/master',
  repository: 'platypus27/teal',
  sourceCommit: '1'.repeat(40),
  sourceRunAttempt: 2,
  sourceRunId: '1234567890123456789',
  workflow: 'platypus27/teal/.github/workflows/protected-release.yml',
}

function fixture() {
  const manifest = {
    schemaVersion: 3,
    decision: 'approve',
    owner: 'kryv-owner',
    operation: 'npm-publish',
    mutations: [
      'npm-publish-if-absent',
      'github-tag-reconcile',
      'github-release-reconcile',
    ],
    approvalReference: 'owner-record-2026-08-07',
    nonce: Buffer.alloc(32, 7).toString('base64'),
    createdAt: '2026-08-07T11:55:00.000Z',
    expiresAt: '2026-08-07T12:10:00.000Z',
    ...expectedContext,
    artifact: {
      name: '@kryv/teal',
      version: '0.5.1',
      integrity: `sha512-${Buffer.alloc(64, 9).toString('base64')}`,
      gitHead: '1'.repeat(40),
    },
  }
  const bytes = canonicalApprovalManifest(manifest)
  const digest = approvalDigest(bytes)
  const signature = sign(
    null,
    Buffer.from(`${APPROVAL_CONTEXT}${digest}\n`),
    privateKey,
  ).toString('base64')
  return { bytes, digest, manifest, signature }
}

function docsFixture() {
  const npm = fixture()
  const manifest = {
    ...npm.manifest,
    operation: 'docs-deploy',
    mutations: ['registry-push', 'production-deploy'],
    environment: 'teal-production',
    artifact: {
      imageId: `sha256:${'2'.repeat(64)}`,
      archiveSha256: `sha256:${'3'.repeat(64)}`,
      repository: 'ghcr.io/platypus27/teal/teal-docs',
    },
  }
  const bytes = canonicalApprovalManifest(manifest)
  const digest = approvalDigest(bytes)
  const signature = sign(
    null,
    Buffer.from(`${APPROVAL_CONTEXT}${digest}\n`),
    privateKey,
  ).toString('base64')
  return { bytes, digest, manifest, signature }
}

test('verifies an exact current Ed25519 owner approval against the pinned key fingerprint', () => {
  const approval = fixture()
  assert.deepEqual(verifyOwnerApproval({
    ...approval,
    expectedDigest: approval.digest,
    manifestBytes: approval.bytes,
    now,
    publicKeyPem,
    trustedFingerprint: parsedKey.fingerprint,
    expectedContext,
  }), {
    digest: approval.digest,
    fingerprint: parsedKey.fingerprint,
    manifest: approval.manifest,
  })
})

test('rejects changed evidence, an untrusted key, and an expired approval', () => {
  const approval = fixture()
  const changed = Buffer.from(approval.bytes)
  changed[changed.length - 2] ^= 1
  assert.throws(
    () => verifyOwnerApproval({
      expectedDigest: approval.digest,
      manifestBytes: changed,
      now,
      publicKeyPem,
      signature: approval.signature,
      trustedFingerprint: parsedKey.fingerprint,
      expectedContext,
    }),
    /approval manifest is invalid JSON|approval manifest is not canonical|approval digest mismatch/i,
  )
  assert.throws(
    () => verifyOwnerApproval({
      expectedDigest: approval.digest,
      manifestBytes: approval.bytes,
      now,
      publicKeyPem,
      signature: approval.signature,
      trustedFingerprint: `sha256:${'0'.repeat(64)}`,
      expectedContext,
    }),
    /trusted owner key fingerprint/i,
  )
  assert.throws(
    () => verifyOwnerApproval({
      expectedDigest: approval.digest,
      manifestBytes: approval.bytes,
      now: new Date('2026-08-09T00:00:00.000Z'),
      publicKeyPem,
      signature: approval.signature,
      trustedFingerprint: parsedKey.fingerprint,
      expectedContext,
    }),
    /approval is outside its validity window/i,
  )
  assert.doesNotThrow(() => verifyOwnerApproval({
    expectedDigest: approval.digest,
    enforceValidity: false,
    manifestBytes: approval.bytes,
    now: new Date('2026-08-09T00:00:00.000Z'),
    publicKeyPem,
    signature: approval.signature,
    trustedFingerprint: parsedKey.fingerprint,
    expectedContext,
  }))
})

test('rejects non-canonical manifests and validity windows longer than 15 minutes', () => {
  const approval = fixture()
  assert.throws(
    () => verifyOwnerApproval({
      expectedDigest: approvalDigest(Buffer.from(JSON.stringify(approval.manifest))),
      manifestBytes: Buffer.from(JSON.stringify(approval.manifest)),
      now,
      publicKeyPem,
      signature: approval.signature,
      trustedFingerprint: parsedKey.fingerprint,
      expectedContext,
    }),
    /approval manifest is not canonical/i,
  )
  const tooLong = {
    ...approval.manifest,
    expiresAt: '2026-08-07T12:10:00.001Z',
  }
  assert.throws(
    () => canonicalApprovalManifest(tooLong),
    /validity window must not exceed 15 minutes/i,
  )
})

test('binds approval to an explicit decision and exact protected mutation context', () => {
  const approval = fixture()
  for (const [field, value] of Object.entries({
    decision: 'reject',
    environment: 'teal-production',
    ref: 'refs/heads/feature',
    repository: 'attacker/teal',
    workflow: 'attacker/teal/.github/workflows/pipeline.yml',
  })) {
    const changed = {
      ...approval.manifest,
      [field]: value,
    }
    assert.throws(
      () => canonicalApprovalManifest(changed),
      new RegExp(field === 'decision' ? 'decision' : field, 'i'),
      field,
    )
  }

  assert.throws(
    () => verifyOwnerApproval({
      expectedDigest: approval.digest,
      manifestBytes: approval.bytes,
      now,
      publicKeyPem,
      signature: approval.signature,
      trustedFingerprint: parsedKey.fingerprint,
      expectedContext: { ...expectedContext, environment: 'teal-production' },
    }),
    /approval environment mismatch/i,
  )

  for (const [field, value] of Object.entries({
    candidateSha256: `sha256:${'b'.repeat(64)}`,
    sourceCommit: '2'.repeat(40),
    sourceRunAttempt: 3,
    sourceRunId: '1234567890123456790',
  })) {
    assert.throws(
      () => verifyOwnerApproval({
        expectedDigest: approval.digest,
        manifestBytes: approval.bytes,
        now,
        publicKeyPem,
        signature: approval.signature,
        trustedFingerprint: parsedKey.fingerprint,
        expectedContext: { ...expectedContext, [field]: value },
      }),
      new RegExp(field, 'i'),
      field,
    )
  }
})

test('requires a canonical 256-bit nonce and rejects unknown manifest fields', () => {
  const approval = fixture()
  assert.throws(
    () => canonicalApprovalManifest({ ...approval.manifest, nonce: 'reusable' }),
    /approval nonce is invalid/i,
  )
  assert.throws(
    () => canonicalApprovalManifest({ ...approval.manifest, unexpected: true }),
    /approval manifest fields are invalid/i,
  )
})

test('binds npm approval to the complete exact mutation set', () => {
  const approval = fixture()
  for (const mutations of [
    ['npm-publish-if-absent'],
    [
      'github-tag-reconcile',
      'npm-publish-if-absent',
      'github-release-reconcile',
    ],
    [
      ...approval.manifest.mutations,
      'docs-deploy',
    ],
  ]) {
    assert.throws(
      () => canonicalApprovalManifest({ ...approval.manifest, mutations }),
      /approval mutation set is invalid/i,
    )
  }
})

test('binds the approved npm artifact to the exact retained descriptor', () => {
  const approval = fixture()
  assert.doesNotThrow(() => assertApprovedArtifact(approval.manifest, {
    integrity: approval.manifest.artifact.integrity,
    name: approval.manifest.artifact.name,
    sourceCommit: approval.manifest.sourceCommit,
    version: approval.manifest.artifact.version,
  }))
  assert.throws(
    () => assertApprovedArtifact(approval.manifest, {
      integrity: `sha512-${Buffer.alloc(64, 3).toString('base64')}`,
      name: approval.manifest.artifact.name,
      sourceCommit: approval.manifest.sourceCommit,
      version: approval.manifest.artifact.version,
    }),
    /approved artifact does not match/i,
  )
})

test('binds docs approval to registry push, production deploy, and the exact image descriptor', () => {
  const approval = docsFixture()
  const context = { ...expectedContext, environment: 'teal-production' }
  assert.deepEqual(verifyOwnerApproval({
    expectedDigest: approval.digest,
    manifestBytes: approval.bytes,
    now,
    publicKeyPem,
    signature: approval.signature,
    trustedFingerprint: parsedKey.fingerprint,
    expectedContext: context,
  }).manifest, approval.manifest)
  assert.doesNotThrow(() => assertApprovedArtifact(approval.manifest, {
    ...approval.manifest.artifact,
    sourceCommit: approval.manifest.sourceCommit,
  }))
})

test('command verifier enforces the checked trust context before accepting an exact descriptor', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'teal-owner-approval-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const base = fixture()
  const currentTime = Date.now()
  const currentManifest = {
    ...base.manifest,
    createdAt: new Date(currentTime - 60_000).toISOString(),
    expiresAt: new Date(currentTime + 10 * 60_000).toISOString(),
  }
  const currentBytes = canonicalApprovalManifest(currentManifest)
  const currentDigest = approvalDigest(currentBytes)
  const approval = {
    bytes: currentBytes,
    digest: currentDigest,
    manifest: currentManifest,
    signature: sign(
      null,
      Buffer.from(`${APPROVAL_CONTEXT}${currentDigest}\n`),
      privateKey,
    ).toString('base64'),
  }
  const manifest = join(directory, 'manifest.json')
  const descriptor = join(directory, 'descriptor.json')
  const key = join(directory, 'owner.pub.pem')
  const trust = join(directory, 'trust.json')
  await Promise.all([
    writeFile(manifest, approval.bytes, { mode: 0o600 }),
    writeFile(descriptor, `${JSON.stringify({
      integrity: approval.manifest.artifact.integrity,
      name: approval.manifest.artifact.name,
      sourceCommit: approval.manifest.sourceCommit,
      version: approval.manifest.artifact.version,
    })}\n`, { mode: 0o600 }),
    writeFile(key, publicKeyPem, { mode: 0o600 }),
    writeFile(trust, `${JSON.stringify({
      schemaVersion: 2,
      algorithm: 'Ed25519',
      owner: 'kryv-owner',
      publicKeyFingerprint: parsedKey.fingerprint,
      repository: expectedContext.repository,
      workflow: expectedContext.workflow,
      ref: expectedContext.ref,
      operationEnvironments: {
        'npm-publish': 'teal-release',
        'docs-deploy': 'teal-production',
      },
    })}\n`, { mode: 0o600 }),
  ])
  const args = [
    verifier,
    '--manifest', manifest,
    '--descriptor', descriptor,
    '--digest', approval.digest,
    '--signature', approval.signature,
    '--public-key', key,
    '--trust-anchor', trust,
    '--operation', 'npm-publish',
    '--candidate-sha256', expectedContext.candidateSha256,
    '--repository', expectedContext.repository,
    '--environment', expectedContext.environment,
    '--workflow', expectedContext.workflow,
    '--ref', expectedContext.ref,
    '--source-commit', expectedContext.sourceCommit,
    '--source-run-attempt', String(expectedContext.sourceRunAttempt),
    '--source-run-id', expectedContext.sourceRunId,
  ]
  const accepted = await execute(process.execPath, args)
  assert.match(accepted.stdout, /Owner approval verified/)

  const directoryAlias = `${directory}-alias`
  await symlink(directory, directoryAlias, 'dir')
  t.after(() => rm(directoryAlias, { force: true }))
  const aliasedArgs = args.map((value) => (
    typeof value === 'string' && value.startsWith(`${directory}/`)
      ? join(directoryAlias, value.slice(directory.length + 1))
      : value
  ))
  await assert.rejects(
    execute(process.execPath, aliasedArgs),
    /bounded canonical regular file/i,
  )

  await assert.rejects(
    execute(process.execPath, args.map((value) => (
      value === expectedContext.environment ? 'teal-production' : value
    ))),
    /Owner trust anchor is not configured/,
  )
})
