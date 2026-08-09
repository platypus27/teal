import {
  createHash,
  createPublicKey,
  verify,
} from 'node:crypto'

export const APPROVAL_CONTEXT = 'Kryv Teal protected mutation approval\n'
const MAX_APPROVAL_WINDOW_MS = 15 * 60 * 1000
const APPROVAL_FIELDS = new Set([
  'approvalReference',
  'artifact',
  'candidateSha256',
  'createdAt',
  'decision',
  'environment',
  'expiresAt',
  'mutations',
  'nonce',
  'operation',
  'owner',
  'ref',
  'repository',
  'schemaVersion',
  'sourceCommit',
  'sourceRunAttempt',
  'sourceRunId',
  'workflow',
])
const APPROVAL_REPOSITORY = 'platypus27/teal'
const APPROVAL_WORKFLOW = 'platypus27/teal/.github/workflows/protected-release.yml'
const APPROVAL_REF = 'refs/heads/master'
const OPERATION_ENVIRONMENTS = new Map([
  ['npm-publish', 'teal-release'],
  ['docs-deploy', 'teal-production'],
])
const OPERATION_MUTATIONS = new Map([
  ['npm-publish', [
    'npm-publish-if-absent',
    'github-tag-reconcile',
    'github-release-reconcile',
  ]],
  ['docs-deploy', [
    'registry-push',
    'production-deploy',
  ]],
])

function isoTimestamp(value, label) {
  if (typeof value !== 'string') throw new Error(`${label} is invalid`)
  const timestamp = new Date(value)
  if (!Number.isFinite(timestamp.getTime()) || timestamp.toISOString() !== value) {
    throw new Error(`${label} is invalid`)
  }
  return timestamp
}

function normalizedArtifact(operation, artifact, sourceCommit) {
  if (operation === 'npm-publish') {
    if (
      artifact?.name !== '@kryv/teal'
      || !/^0\.\d+\.\d+$/.test(artifact.version)
      || !/^sha512-[A-Za-z0-9+/]{86}==$/.test(artifact.integrity)
      || artifact.gitHead !== sourceCommit
    ) {
      throw new Error('npm approval artifact is invalid')
    }
    return {
      name: artifact.name,
      version: artifact.version,
      integrity: artifact.integrity,
      gitHead: artifact.gitHead,
    }
  }
  if (operation === 'docs-deploy') {
    if (
      !/^sha256:[0-9a-f]{64}$/.test(artifact?.imageId)
      || !/^sha256:[0-9a-f]{64}$/.test(artifact?.archiveSha256)
      || !/^ghcr\.io\/[a-z0-9_.-]+\/[a-z0-9_.\/-]+$/.test(artifact?.repository)
    ) {
      throw new Error('documentation approval artifact is invalid')
    }
    return {
      imageId: artifact.imageId,
      archiveSha256: artifact.archiveSha256,
      repository: artifact.repository,
    }
  }
  throw new Error('approval operation is invalid')
}

function normalizeManifest(manifest) {
  if (manifest?.schemaVersion !== 3) throw new Error('approval schema version is invalid')
  if (
    Object.keys(manifest).length !== APPROVAL_FIELDS.size
    || Object.keys(manifest).some((field) => !APPROVAL_FIELDS.has(field))
  ) {
    throw new Error('approval manifest fields are invalid')
  }
  if (manifest.decision !== 'approve') throw new Error('approval decision is invalid')
  if (manifest.owner !== 'kryv-owner') throw new Error('approval owner is invalid')
  if (manifest.repository !== APPROVAL_REPOSITORY) {
    throw new Error('approval repository is invalid')
  }
  if (manifest.workflow !== APPROVAL_WORKFLOW) {
    throw new Error('approval workflow is invalid')
  }
  if (manifest.ref !== APPROVAL_REF) throw new Error('approval ref is invalid')
  const requiredEnvironment = OPERATION_ENVIRONMENTS.get(manifest.operation)
  if (!requiredEnvironment) throw new Error('approval operation is invalid')
  if (manifest.environment !== requiredEnvironment) {
    throw new Error('approval environment is invalid')
  }
  if (
    !Array.isArray(manifest.mutations)
    || JSON.stringify(manifest.mutations) !== JSON.stringify(OPERATION_MUTATIONS.get(manifest.operation))
  ) {
    throw new Error('approval mutation set is invalid')
  }
  if (typeof manifest.nonce !== 'string' || !/^[A-Za-z0-9+/]{43}=$/.test(manifest.nonce)) {
    throw new Error('approval nonce is invalid')
  }
  const nonce = Buffer.from(manifest.nonce, 'base64')
  if (nonce.length !== 32 || nonce.toString('base64') !== manifest.nonce) {
    throw new Error('approval nonce is invalid')
  }
  if (!/^[0-9a-f]{40}$/.test(manifest.sourceCommit)) {
    throw new Error('approval source commit is invalid')
  }
  if (!/^sha256:[0-9a-f]{64}$/.test(manifest.candidateSha256)) {
    throw new Error('approval candidateSha256 is invalid')
  }
  if (!/^[1-9][0-9]{0,19}$/.test(manifest.sourceRunId)) {
    throw new Error('approval sourceRunId is invalid')
  }
  if (
    !Number.isSafeInteger(manifest.sourceRunAttempt)
    || manifest.sourceRunAttempt < 1
    || manifest.sourceRunAttempt > 1000
  ) {
    throw new Error('approval sourceRunAttempt is invalid')
  }
  if (
    typeof manifest.approvalReference !== 'string'
    || manifest.approvalReference.length === 0
    || manifest.approvalReference.length > 200
    || /[\0\r\n]/.test(manifest.approvalReference)
  ) {
    throw new Error('approval reference is invalid')
  }
  const createdAt = isoTimestamp(manifest.createdAt, 'approval creation time')
  const expiresAt = isoTimestamp(manifest.expiresAt, 'approval expiry time')
  const window = expiresAt.getTime() - createdAt.getTime()
  if (window <= 0 || window > MAX_APPROVAL_WINDOW_MS) {
    throw new Error('Approval validity window must not exceed 15 minutes')
  }
  return {
    schemaVersion: 3,
    decision: manifest.decision,
    owner: manifest.owner,
    operation: manifest.operation,
    mutations: [...manifest.mutations],
    approvalReference: manifest.approvalReference,
    nonce: manifest.nonce,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    repository: manifest.repository,
    environment: manifest.environment,
    workflow: manifest.workflow,
    ref: manifest.ref,
    sourceCommit: manifest.sourceCommit,
    sourceRunId: manifest.sourceRunId,
    sourceRunAttempt: manifest.sourceRunAttempt,
    candidateSha256: manifest.candidateSha256,
    artifact: normalizedArtifact(
      manifest.operation,
      manifest.artifact,
      manifest.sourceCommit,
    ),
  }
}

export function canonicalApprovalManifest(manifest) {
  return Buffer.from(`${JSON.stringify(normalizeManifest(manifest), null, 2)}\n`)
}

export function approvalDigest(manifestBytes) {
  return `sha256:${createHash('sha256').update(manifestBytes).digest('hex')}`
}

export function approvalPublicKey(pem) {
  let publicKey
  try {
    publicKey = createPublicKey(pem)
  } catch {
    throw new Error('Owner approval public key is invalid')
  }
  if (publicKey.asymmetricKeyType !== 'ed25519') {
    throw new Error('Owner approval public key must be Ed25519')
  }
  const der = publicKey.export({ format: 'der', type: 'spki' })
  return {
    fingerprint: `sha256:${createHash('sha256').update(der).digest('hex')}`,
    publicKey,
  }
}

export function assertApprovedArtifact(manifest, descriptor) {
  let approved
  let actual
  if (manifest?.operation === 'npm-publish') {
    approved = {
      integrity: manifest.artifact?.integrity,
      name: manifest.artifact?.name,
      sourceCommit: manifest.sourceCommit,
      version: manifest.artifact?.version,
    }
    actual = {
      integrity: descriptor?.integrity,
      name: descriptor?.name,
      sourceCommit: descriptor?.sourceCommit,
      version: descriptor?.version,
    }
  } else if (manifest?.operation === 'docs-deploy') {
    approved = {
      archiveSha256: manifest.artifact?.archiveSha256,
      imageId: manifest.artifact?.imageId,
      repository: manifest.artifact?.repository,
      sourceCommit: manifest.sourceCommit,
    }
    actual = {
      archiveSha256: descriptor?.archiveSha256,
      imageId: descriptor?.imageId,
      repository: descriptor?.repository,
      sourceCommit: descriptor?.sourceCommit,
    }
  } else {
    throw new Error('Approval operation is invalid')
  }
  if (JSON.stringify(approved) !== JSON.stringify(actual)) {
    throw new Error('Approved artifact does not match the retained descriptor')
  }
}

export function verifyOwnerApproval({
  enforceValidity = true,
  expectedDigest,
  expectedContext,
  manifestBytes,
  now = new Date(),
  publicKeyPem,
  signature,
  trustedFingerprint,
}) {
  let manifest
  try {
    manifest = JSON.parse(manifestBytes.toString('utf8'))
  } catch {
    throw new Error('Owner approval manifest is invalid JSON')
  }
  const canonical = canonicalApprovalManifest(manifest)
  if (!Buffer.from(manifestBytes).equals(canonical)) {
    throw new Error('Owner approval manifest is not canonical')
  }
  const digest = approvalDigest(canonical)
  if (!/^sha256:[0-9a-f]{64}$/.test(expectedDigest) || digest !== expectedDigest) {
    throw new Error('Owner approval digest mismatch')
  }
  const nowTime = now.getTime()
  const createdAt = new Date(manifest.createdAt).getTime()
  const expiresAt = new Date(manifest.expiresAt).getTime()
  if (typeof enforceValidity !== 'boolean') {
    throw new Error('Owner approval validity policy is invalid')
  }
  if (enforceValidity && (!Number.isFinite(nowTime) || nowTime < createdAt || nowTime > expiresAt)) {
    throw new Error('Owner approval is outside its validity window')
  }
  if (!expectedContext || typeof expectedContext !== 'object') {
    throw new Error('Owner approval context is required')
  }
  for (const field of [
    'repository',
    'environment',
    'workflow',
    'ref',
    'sourceCommit',
    'sourceRunId',
    'sourceRunAttempt',
    'candidateSha256',
  ]) {
    if (manifest[field] !== expectedContext[field]) {
      throw new Error(`Owner approval ${field} mismatch`)
    }
  }
  const key = approvalPublicKey(publicKeyPem)
  if (
    !/^sha256:[0-9a-f]{64}$/.test(trustedFingerprint)
    || key.fingerprint !== trustedFingerprint
  ) {
    throw new Error('Trusted owner key fingerprint does not match supplied key')
  }
  if (typeof signature !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(signature)) {
    throw new Error('Owner approval signature is invalid')
  }
  const signatureBytes = Buffer.from(signature, 'base64')
  if (signatureBytes.length !== 64 || signatureBytes.toString('base64') !== signature) {
    throw new Error('Owner approval signature is invalid')
  }
  const message = Buffer.from(`${APPROVAL_CONTEXT}${digest}\n`)
  if (!verify(null, message, key.publicKey, signatureBytes)) {
    throw new Error('Owner approval signature verification failed')
  }
  return { digest, fingerprint: key.fingerprint, manifest }
}
