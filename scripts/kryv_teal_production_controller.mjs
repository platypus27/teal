import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { constants } from 'node:fs'
import {
  lstat,
  mkdir,
  open,
  realpath,
  rename,
  rm,
} from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { validateDocsEvidenceDirectory } from './assemble-release-candidate.mjs'
import { authorizeAndConsumeOwnerApproval } from './teal_owner_authority.mjs'
import {
  sha256Bytes,
  verifyCandidateDirectory,
} from './teal_release_candidate.mjs'

export const FLOCK_EXECUTABLE = '/usr/bin/flock'

const DOCKER_EXECUTABLE = '/usr/bin/docker'
const CURL_EXECUTABLE = '/usr/bin/curl'
const TRIVY_IMAGE = 'aquasec/trivy:0.73.0@sha256:7cced7cae583819fc7806d4cbc0dbbc7cad18b99f7d3e235192e6da8c091045c'
const MAX_FILE_BYTES = 8 * 1024 * 1024 * 1024
const MAX_JSON_BYTES = 8 * 1024 * 1024
const MAX_PROCESS_OUTPUT = 50 * 1024 * 1024
const PRODUCTION_REPOSITORY = 'ghcr.io/platypus27/teal/teal-docs'
const PRODUCTION_STATE_ROOT = '/var/lib/kryv-teal-production'
const CONSUMED_APPROVALS_ROOT = '/var/lib/kryv-teal-production/consumed-approvals'
const CURRENT_RELEASE_PATH = '/var/lib/kryv-teal-production/current-release.json'
const OBSERVATION_PATH = '/var/lib/kryv-teal-production/observation.json'
const TRANSACTION_PATH = '/var/lib/kryv-teal-production/deployment-transaction.json'
const STATE_FIELDS = new Set([
  'candidateSha256',
  'deployedAt',
  'imageDigest',
  'imageId',
  'modelPath',
  'previousCandidateSha256',
  'schemaVersion',
  'sourceCommit',
  'sourceRunAttempt',
  'sourceRunId',
])
const TRANSACTION_FIELDS = new Set([
  'approvalDigest',
  'phase',
  'previousRelease',
  'schemaVersion',
  'targetRelease',
  'updatedAt',
])
const TRANSACTION_PHASES = new Set([
  'authorization-pending',
  'authorized',
  'image-published',
  'rollout-started',
])

function exactFields(value, fields, label) {
  if (
    !value
    || Array.isArray(value)
    || typeof value !== 'object'
    || Object.keys(value).length !== fields.size
    || Object.keys(value).some((field) => !fields.has(field))
  ) {
    throw new Error(`${label} fields are invalid`)
  }
}

function currentTime(clock) {
  if (typeof clock !== 'function') throw new Error('Controller clock is required')
  const value = clock()
  if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
    throw new Error('Controller clock returned an invalid time')
  }
  return value
}

async function stableFile(path, maximumBytes = MAX_FILE_BYTES) {
  let handle
  try {
    handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW)
    const before = await handle.stat({ bigint: true })
    if (!before.isFile() || before.size < 1n || before.size > BigInt(maximumBytes)) {
      throw new Error(`File is not a bounded regular file: ${path}`)
    }
    const chunks = []
    let bytes = 0
    for await (const chunk of handle.createReadStream({ autoClose: false })) {
      bytes += chunk.length
      if (bytes > maximumBytes) throw new Error(`File exceeds its byte bound: ${path}`)
      chunks.push(chunk)
    }
    const after = await handle.stat({ bigint: true })
    if (
      before.dev !== after.dev
      || before.ino !== after.ino
      || before.size !== after.size
      || before.mtimeNs !== after.mtimeNs
      || before.ctimeNs !== after.ctimeNs
    ) {
      throw new Error(`File changed while it was read: ${path}`)
    }
    return Buffer.concat(chunks)
  } finally {
    await handle?.close()
  }
}

async function copyStableFile(source, destination) {
  let input
  let output
  try {
    input = await open(source, constants.O_RDONLY | constants.O_NOFOLLOW)
    const before = await input.stat({ bigint: true })
    if (!before.isFile() || before.size < 1n || before.size > BigInt(MAX_FILE_BYTES)) {
      throw new Error(`Candidate input is not a bounded regular file: ${source}`)
    }
    output = await open(
      destination,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
      0o400,
    )
    const buffer = Buffer.allocUnsafe(1024 * 1024)
    let offset = 0n
    while (offset < before.size) {
      const length = Number(before.size - offset > BigInt(buffer.length)
        ? BigInt(buffer.length)
        : before.size - offset)
      const { bytesRead } = await input.read(buffer, 0, length, Number(offset))
      if (bytesRead < 1) throw new Error('Candidate input ended during copy')
      let written = 0
      while (written < bytesRead) {
        const result = await output.write(buffer, written, bytesRead - written, Number(offset) + written)
        if (result.bytesWritten < 1) throw new Error('Candidate output write made no progress')
        written += result.bytesWritten
      }
      offset += BigInt(bytesRead)
    }
    await output.sync()
    const after = await input.stat({ bigint: true })
    if (
      before.dev !== after.dev
      || before.ino !== after.ino
      || before.size !== after.size
      || before.mtimeNs !== after.mtimeNs
      || before.ctimeNs !== after.ctimeNs
    ) {
      throw new Error('Candidate input changed during copy')
    }
  } finally {
    await output?.close()
    await input?.close()
  }
}

async function syncDirectory(path) {
  const handle = await open(path, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW)
  try {
    await handle.sync()
  } finally {
    await handle.close()
  }
}

async function trustedDirectory(path, requiredOwnerUid, mode = 0o700) {
  const absolute = resolve(path)
  const metadata = await lstat(absolute)
  if (
    !metadata.isDirectory()
    || metadata.isSymbolicLink()
    || await realpath(absolute) !== absolute
    || metadata.uid !== requiredOwnerUid
    || (metadata.mode & 0o777) !== mode
  ) {
    throw new Error(`Trusted directory must be canonical, owner-controlled, and mode ${mode.toString(8)}: ${path}`)
  }
  return absolute
}

async function publishJson(path, value, requiredOwnerUid) {
  const parent = await trustedDirectory(dirname(path), requiredOwnerUid)
  const pending = join(parent, `.${path.split('/').at(-1)}.pending-${process.pid}-${randomBytes(8).toString('hex')}`)
  const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`)
  let handle
  try {
    handle = await open(
      pending,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
      0o600,
    )
    let offset = 0
    while (offset < bytes.length) {
      const { bytesWritten } = await handle.write(bytes, offset, bytes.length - offset, offset)
      if (bytesWritten < 1) throw new Error('State write made no progress')
      offset += bytesWritten
    }
    await handle.sync()
    const metadata = await handle.stat()
    if (
      !metadata.isFile()
      || metadata.uid !== requiredOwnerUid
      || (metadata.mode & 0o777) !== 0o600
      || metadata.size !== bytes.length
    ) {
      throw new Error('Published state file metadata is invalid')
    }
    await handle.close()
    handle = undefined
    await rename(pending, path)
    await syncDirectory(parent)
  } finally {
    await handle?.close()
    await rm(pending, { force: true })
  }
}

function expectedCandidateContext(context) {
  if (
    context?.repository !== 'platypus27/teal'
    || context.workflow !== 'platypus27/teal/.github/workflows/protected-release.yml'
    || context.ref !== 'refs/heads/master'
    || context.environment !== 'teal-production'
    || !/^[0-9a-f]{40}$/.test(context.sourceCommit)
    || !/^[1-9][0-9]{0,19}$/.test(context.sourceRunId)
    || !Number.isSafeInteger(context.sourceRunAttempt)
    || context.sourceRunAttempt < 1
    || context.sourceRunAttempt > 1000
    || !/^sha256:[0-9a-f]{64}$/.test(context.candidateSha256)
  ) {
    throw new Error('Production candidate context is invalid')
  }
  return context
}

async function stageCandidate({
  candidateRoot,
  expectedContext,
  releasesRoot,
  requiredOwnerUid,
}) {
  const sourceRoot = resolve(candidateRoot)
  const manifestBytes = await stableFile(join(sourceRoot, 'candidate-manifest.json'), 1024 * 1024)
  const producerContext = {
    ...expectedContext,
    workflow: 'platypus27/teal/.github/workflows/pipeline.yml',
  }
  const verified = await verifyCandidateDirectory({
    expectedContext: producerContext,
    manifestBytes,
    root: sourceRoot,
  })
  if (verified.manifestSha256 !== expectedContext.candidateSha256) {
    throw new Error('Candidate manifest digest does not match owner-approved context')
  }

  const trustedReleasesRoot = await trustedDirectory(releasesRoot, requiredOwnerUid)
  const target = join(trustedReleasesRoot, expectedContext.candidateSha256.slice('sha256:'.length))
  try {
    const metadata = await lstat(target)
    if (!metadata.isDirectory() || metadata.isSymbolicLink()) {
      throw new Error('Retained candidate target is not a directory')
    }
    const retainedManifest = await stableFile(join(target, 'candidate-manifest.json'), 1024 * 1024)
    await verifyCandidateDirectory({ expectedContext: producerContext, manifestBytes: retainedManifest, root: target })
    return { manifest: verified.manifest, root: target }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }

  const pending = join(
    trustedReleasesRoot,
    `.${expectedContext.candidateSha256.slice('sha256:'.length)}.pending-${process.pid}-${randomBytes(8).toString('hex')}`,
  )
  try {
    await mkdir(pending, { mode: 0o700 })
    for (const file of verified.manifest.files) {
      const destination = join(pending, file.path)
      await mkdir(dirname(destination), { recursive: true, mode: 0o700 })
      await copyStableFile(join(sourceRoot, file.path), destination)
    }
    await copyStableFile(join(sourceRoot, 'candidate-manifest.json'), join(pending, 'candidate-manifest.json'))
    const retainedManifest = await stableFile(join(pending, 'candidate-manifest.json'), 1024 * 1024)
    await verifyCandidateDirectory({ expectedContext: producerContext, manifestBytes: retainedManifest, root: pending })
    await rename(pending, target)
    await syncDirectory(trustedReleasesRoot)
    return { manifest: verified.manifest, root: target }
  } catch (error) {
    await rm(pending, { recursive: true, force: true })
    throw error
  }
}

async function sha256File(path) {
  return sha256Bytes(await stableFile(path))
}

function normalizeRelease(value, stateRoot) {
  exactFields(value, STATE_FIELDS, 'Current release')
  if (
    value.schemaVersion !== 1
    || !/^sha256:[0-9a-f]{64}$/.test(value.candidateSha256)
    || !/^[0-9a-f]{40}$/.test(value.sourceCommit)
    || !/^[1-9][0-9]{0,19}$/.test(value.sourceRunId)
    || !Number.isSafeInteger(value.sourceRunAttempt)
    || value.sourceRunAttempt < 1
    || value.sourceRunAttempt > 1000
    || !/^sha256:[0-9a-f]{64}$/.test(value.imageId)
    || !new RegExp(`^${PRODUCTION_REPOSITORY.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}@sha256:[0-9a-f]{64}$`).test(value.imageDigest)
    || (value.previousCandidateSha256 !== null && !/^sha256:[0-9a-f]{64}$/.test(value.previousCandidateSha256))
  ) {
    throw new Error('Current release identity is invalid')
  }
  const deployedAt = new Date(value.deployedAt)
  if (!Number.isFinite(deployedAt.getTime()) || deployedAt.toISOString() !== value.deployedAt) {
    throw new Error('Current release deployment time is invalid')
  }
  const expectedModel = join(
    resolve(stateRoot),
    'releases',
    value.candidateSha256.slice('sha256:'.length),
    'deploy.docs.yml',
  )
  if (resolve(value.modelPath) !== expectedModel) {
    throw new Error('Current release model path is outside its retained candidate')
  }
  return { ...value }
}

async function readCurrentRelease(stateRoot, requiredOwnerUid) {
  const resolvedStateRoot = resolve(stateRoot)
  const path = resolvedStateRoot === PRODUCTION_STATE_ROOT
    ? CURRENT_RELEASE_PATH
    : join(resolvedStateRoot, 'current-release.json')
  let metadata
  try {
    metadata = await lstat(path)
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined
    throw error
  }
  if (
    !metadata.isFile()
    || metadata.isSymbolicLink()
    || metadata.uid !== requiredOwnerUid
    || (metadata.mode & 0o777) !== 0o600
    || metadata.size < 1
    || metadata.size > MAX_JSON_BYTES
  ) {
    throw new Error('Current release file is not trusted')
  }
  let value
  try {
    value = JSON.parse((await stableFile(path, MAX_JSON_BYTES)).toString('utf8'))
  } catch {
    throw new Error('Current release file is invalid JSON')
  }
  return normalizeRelease(value, stateRoot)
}

function stateFilePath(stateRoot, productionPath, filename) {
  const resolvedStateRoot = resolve(stateRoot)
  return resolvedStateRoot === PRODUCTION_STATE_ROOT
    ? productionPath
    : join(resolvedStateRoot, filename)
}

function normalizeTransaction(value, stateRoot) {
  exactFields(value, TRANSACTION_FIELDS, 'Deployment transaction')
  if (
    value.schemaVersion !== 1
    || !TRANSACTION_PHASES.has(value.phase)
    || !/^sha256:[0-9a-f]{64}$/.test(value.approvalDigest)
  ) {
    throw new Error('Deployment transaction identity is invalid')
  }
  const updatedAt = new Date(value.updatedAt)
  if (!Number.isFinite(updatedAt.getTime()) || updatedAt.toISOString() !== value.updatedAt) {
    throw new Error('Deployment transaction time is invalid')
  }
  const previousRelease = value.previousRelease === null
    ? null
    : normalizeRelease(value.previousRelease, stateRoot)
  const targetRelease = value.targetRelease === null
    ? null
    : normalizeRelease(value.targetRelease, stateRoot)
  if (
    ['authorization-pending', 'authorized'].includes(value.phase) !== (targetRelease === null)
    || (targetRelease && targetRelease.previousCandidateSha256 !== previousRelease?.candidateSha256 && previousRelease !== null)
    || (targetRelease && previousRelease === null && targetRelease.previousCandidateSha256 !== null)
  ) {
    throw new Error('Deployment transaction phase is invalid')
  }
  return { ...value, previousRelease, targetRelease }
}

async function readProductionTransaction(stateRoot, requiredOwnerUid) {
  const path = stateFilePath(stateRoot, TRANSACTION_PATH, 'deployment-transaction.json')
  let metadata
  try {
    metadata = await lstat(path)
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined
    throw error
  }
  if (
    !metadata.isFile()
    || metadata.isSymbolicLink()
    || metadata.uid !== requiredOwnerUid
    || (metadata.mode & 0o777) !== 0o600
    || metadata.size < 1
    || metadata.size > MAX_JSON_BYTES
  ) {
    throw new Error('Deployment transaction file is not trusted')
  }
  let value
  try {
    value = JSON.parse((await stableFile(path, MAX_JSON_BYTES)).toString('utf8'))
  } catch {
    throw new Error('Deployment transaction file is invalid JSON')
  }
  return normalizeTransaction(value, stateRoot)
}

async function publishProductionTransaction(stateRoot, transaction, requiredOwnerUid) {
  const normalized = normalizeTransaction(transaction, stateRoot)
  await publishJson(
    stateFilePath(stateRoot, TRANSACTION_PATH, 'deployment-transaction.json'),
    normalized,
    requiredOwnerUid,
  )
}

async function removeTrustedStateFile(path, requiredOwnerUid, { missing = false } = {}) {
  const parent = await trustedDirectory(dirname(path), requiredOwnerUid)
  let metadata
  try {
    metadata = await lstat(path)
  } catch (error) {
    if (missing && error?.code === 'ENOENT') return false
    throw error
  }
  if (
    !metadata.isFile()
    || metadata.isSymbolicLink()
    || metadata.uid !== requiredOwnerUid
    || (metadata.mode & 0o777) !== 0o600
  ) {
    throw new Error(`State file is not trusted: ${path}`)
  }
  await rm(path)
  await syncDirectory(parent)
  return true
}

export async function observeProductionRelease({ adapter, clock = () => new Date(), release }) {
  const facts = await adapter.observe({
    expectedImageId: release.imageId,
    imageDigest: release.imageDigest,
    modelPath: release.modelPath,
  })
  if (!/^[0-9a-f]{12,64}$/.test(facts?.containerId ?? '')) {
    throw new Error('Production container identity is invalid')
  }
  if (facts.configuredImage !== release.imageDigest) {
    throw new Error('Production configured image identity drift')
  }
  if (facts.runningImageId !== release.imageId) {
    throw new Error('Production runtime image identity drift')
  }
  if (facts.health !== 'healthy') {
    throw new Error(`Production health is ${facts?.health ?? 'missing'}`)
  }
  return {
    schemaVersion: 1,
    status: 'healthy',
    observedAt: currentTime(clock).toISOString(),
    candidateSha256: release.candidateSha256,
    sourceCommit: release.sourceCommit,
    imageId: release.imageId,
    imageDigest: release.imageDigest,
    containerId: facts.containerId,
  }
}

export async function recordProductionObservation({
  adapter,
  clock = () => new Date(),
  release,
  requiredOwnerUid = 0,
  stateRoot,
}) {
  const trustedStateRoot = await trustedDirectory(stateRoot, requiredOwnerUid)
  const observationPath = stateFilePath(trustedStateRoot, OBSERVATION_PATH, 'observation.json')
  try {
    const observation = await observeProductionRelease({ adapter, clock, release })
    await publishJson(observationPath, observation, requiredOwnerUid)
    return observation
  } catch (error) {
    await publishJson(observationPath, {
      schemaVersion: 1,
      status: 'unhealthy',
      observedAt: currentTime(clock).toISOString(),
      candidateSha256: release.candidateSha256,
      sourceCommit: release.sourceCommit,
      imageId: release.imageId,
      imageDigest: release.imageDigest,
      error: String(error?.message ?? error).slice(0, 1000),
    }, requiredOwnerUid)
    throw error
  }
}

export async function recoverProductionTransaction({
  adapter,
  clock = () => new Date(),
  requiredOwnerUid = 0,
  stateRoot,
}) {
  const trustedStateRoot = await trustedDirectory(stateRoot, requiredOwnerUid)
  const transaction = await readProductionTransaction(trustedStateRoot, requiredOwnerUid)
  if (!transaction) return undefined
  let recoveryAction = 'cleared-before-rollout'
  if (transaction.phase === 'rollout-started') {
    if (transaction.previousRelease) {
      await adapter.rollout({
        expectedImageId: transaction.previousRelease.imageId,
        imageDigest: transaction.previousRelease.imageDigest,
        modelPath: transaction.previousRelease.modelPath,
      })
      await observeProductionRelease({ adapter, clock, release: transaction.previousRelease })
      await publishJson(
        stateFilePath(trustedStateRoot, CURRENT_RELEASE_PATH, 'current-release.json'),
        transaction.previousRelease,
        requiredOwnerUid,
      )
      recoveryAction = 'restored-previous-release'
    } else {
      const current = await readCurrentRelease(trustedStateRoot, requiredOwnerUid)
      if (current && current.candidateSha256 !== transaction.targetRelease.candidateSha256) {
        throw new Error('First-deployment recovery found an unrelated current release')
      }
      await adapter.stop({ modelPath: transaction.targetRelease.modelPath })
      await removeTrustedStateFile(
        stateFilePath(trustedStateRoot, CURRENT_RELEASE_PATH, 'current-release.json'),
        requiredOwnerUid,
        { missing: true },
      )
      recoveryAction = 'stopped-first-deployment'
    }
  }
  const observation = {
    schemaVersion: 1,
    status: 'recovered',
    observedAt: currentTime(clock).toISOString(),
    candidateSha256: transaction.targetRelease?.candidateSha256 ?? transaction.previousRelease?.candidateSha256 ?? null,
    sourceCommit: transaction.targetRelease?.sourceCommit ?? transaction.previousRelease?.sourceCommit ?? null,
    interruptedPhase: transaction.phase,
    recoveryAction,
  }
  await publishJson(
    stateFilePath(trustedStateRoot, OBSERVATION_PATH, 'observation.json'),
    observation,
    requiredOwnerUid,
  )
  await removeTrustedStateFile(
    stateFilePath(trustedStateRoot, TRANSACTION_PATH, 'deployment-transaction.json'),
    requiredOwnerUid,
  )
  return observation
}

export async function deployProductionCandidate({
  adapter,
  approvalDigest,
  approvalManifestBytes,
  approvalSignature,
  candidateRoot,
  clock = () => new Date(),
  controllerArchiveSha256,
  expectedContext,
  ledgerRoot,
  publicKeyPem,
  registryToken,
  registryUser,
  requiredOwnerUid = 0,
  stateRoot,
  trustAnchorBytes,
  trustedFingerprint,
}) {
  const context = expectedCandidateContext(expectedContext)
  const trustedStateRoot = await trustedDirectory(stateRoot, requiredOwnerUid)
  const trustedLedgerRoot = await trustedDirectory(ledgerRoot, requiredOwnerUid)
  if (dirname(trustedLedgerRoot) !== trustedStateRoot) {
    throw new Error('Approval ledger is outside the production state root')
  }
  const releasesRoot = join(trustedStateRoot, 'releases')
  try {
    await mkdir(releasesRoot, { mode: 0o700 })
  } catch (error) {
    if (error?.code !== 'EEXIST') throw error
  }
  await trustedDirectory(releasesRoot, requiredOwnerUid)
  await recoverProductionTransaction({
    adapter,
    clock,
    requiredOwnerUid,
    stateRoot: trustedStateRoot,
  })

  const staged = await stageCandidate({
    candidateRoot,
    expectedContext: context,
    releasesRoot,
    requiredOwnerUid,
  })
  if (
    !/^sha256:[0-9a-f]{64}$/.test(controllerArchiveSha256)
    || await sha256File(join(staged.root, 'controller/kryv-teal-production-controller.tar'))
      !== controllerArchiveSha256
  ) {
    throw new Error('Candidate controller archive does not match the installed fixed controller')
  }
  if (
    !Buffer.isBuffer(trustAnchorBytes)
    || !trustAnchorBytes.equals(await stableFile(join(staged.root, 'infra/release-owner-approval.json'), MAX_JSON_BYTES))
  ) {
    throw new Error('Candidate owner trust anchor differs from the installed trust anchor')
  }
  const descriptor = await validateDocsEvidenceDirectory(join(staged.root, 'docs'), context.sourceCommit)
  const previous = await readCurrentRelease(trustedStateRoot, requiredOwnerUid)
  if (previous) {
    await observeProductionRelease({ adapter, clock, release: previous })
  }
  if (
    typeof registryUser !== 'string'
    || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(registryUser)
    || typeof registryToken !== 'string'
    || registryToken.length < 1
    || registryToken.length > 4096
    || /[\0\r\n\s]/.test(registryToken)
  ) {
    throw new Error('Registry credentials are invalid')
  }

  let release
  let rolloutStarted = false
  const transaction = (phase, targetRelease = null) => ({
    schemaVersion: 1,
    phase,
    approvalDigest,
    previousRelease: previous ?? null,
    targetRelease,
    updatedAt: currentTime(clock).toISOString(),
  })
  await publishProductionTransaction(
    trustedStateRoot,
    transaction('authorization-pending'),
    requiredOwnerUid,
  )
  try {
    await adapter.loadImage({
      archivePath: join(staged.root, 'docs', descriptor.archive),
      imageId: descriptor.imageId,
    })
    await adapter.verifyCandidate({
      archivePath: join(staged.root, 'docs', descriptor.archive),
      imageId: descriptor.imageId,
    })
    await authorizeAndConsumeOwnerApproval({
      clock,
      descriptor,
      digest: approvalDigest,
      expectedContext: context,
      ledgerRoot: trustedLedgerRoot,
      manifestBytes: approvalManifestBytes,
      publicKeyPem,
      requiredOwnerUid,
      signature: approvalSignature,
      trustedFingerprint,
    })
    await publishProductionTransaction(
      trustedStateRoot,
      transaction('authorized'),
      requiredOwnerUid,
    )
    const imageDigest = await adapter.publishImage({
      candidateSha256: context.candidateSha256,
      imageId: descriptor.imageId,
      repository: descriptor.repository,
      registryToken,
      registryUser,
      sourceCommit: context.sourceCommit,
    })
    if (!new RegExp(`^${PRODUCTION_REPOSITORY.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}@sha256:[0-9a-f]{64}$`).test(imageDigest)) {
      throw new Error('Registry returned an invalid immutable image digest')
    }
    release = {
      schemaVersion: 1,
      candidateSha256: context.candidateSha256,
      sourceCommit: context.sourceCommit,
      sourceRunId: context.sourceRunId,
      sourceRunAttempt: context.sourceRunAttempt,
      imageId: descriptor.imageId,
      imageDigest,
      modelPath: join(staged.root, 'deploy.docs.yml'),
      deployedAt: currentTime(clock).toISOString(),
      previousCandidateSha256: previous?.candidateSha256 ?? null,
    }
    await publishProductionTransaction(
      trustedStateRoot,
      transaction('image-published', release),
      requiredOwnerUid,
    )
    await publishProductionTransaction(
      trustedStateRoot,
      transaction('rollout-started', release),
      requiredOwnerUid,
    )
    rolloutStarted = true
    await adapter.rollout({
      expectedImageId: release.imageId,
      imageDigest: release.imageDigest,
      modelPath: release.modelPath,
    })
    const observation = await observeProductionRelease({ adapter, clock, release })
    await publishJson(
      stateFilePath(trustedStateRoot, CURRENT_RELEASE_PATH, 'current-release.json'),
      release,
      requiredOwnerUid,
    )
    await publishJson(
      stateFilePath(trustedStateRoot, OBSERVATION_PATH, 'observation.json'),
      observation,
      requiredOwnerUid,
    )
    await removeTrustedStateFile(
      stateFilePath(trustedStateRoot, TRANSACTION_PATH, 'deployment-transaction.json'),
      requiredOwnerUid,
    )
    return { observation, release }
  } catch (error) {
    let rollbackError
    let rollbackStatus = 'not-required'
    try {
      if (rolloutStarted && previous) {
        await adapter.rollout({
          expectedImageId: previous.imageId,
          imageDigest: previous.imageDigest,
          modelPath: previous.modelPath,
        })
        await observeProductionRelease({ adapter, clock, release: previous })
        await publishJson(
          stateFilePath(trustedStateRoot, CURRENT_RELEASE_PATH, 'current-release.json'),
          previous,
          requiredOwnerUid,
        )
        rollbackStatus = 'verified'
      } else if (rolloutStarted && release) {
        await adapter.stop({ modelPath: release.modelPath })
        await removeTrustedStateFile(
          stateFilePath(trustedStateRoot, CURRENT_RELEASE_PATH, 'current-release.json'),
          requiredOwnerUid,
          { missing: true },
        )
        rollbackStatus = 'stopped-first-deployment'
      }
    } catch (failure) {
      rollbackError = failure
      rollbackStatus = 'failed'
    }
    await publishJson(stateFilePath(trustedStateRoot, OBSERVATION_PATH, 'observation.json'), {
      schemaVersion: 1,
      status: 'deployment-failed',
      observedAt: currentTime(clock).toISOString(),
      candidateSha256: context.candidateSha256,
      sourceCommit: context.sourceCommit,
      rollbackStatus,
      error: String(error?.message ?? error).slice(0, 1000),
      rollbackError: rollbackError ? String(rollbackError.message ?? rollbackError).slice(0, 1000) : null,
    }, requiredOwnerUid)
    if (rollbackError) {
      throw new AggregateError([error, rollbackError], 'Production rollout and rollback failed')
    }
    await removeTrustedStateFile(
      stateFilePath(trustedStateRoot, TRANSACTION_PATH, 'deployment-transaction.json'),
      requiredOwnerUid,
    )
    throw new Error(`Production rollout failure: ${error?.message ?? error}`, { cause: error })
  }
}

async function spawnFixed(command, args, { env, input, timeout = 120_000 } = {}) {
  return new Promise((resolveCommand, reject) => {
    const child = spawn(command, args, {
      env: env ?? { PATH: '/usr/bin:/bin', LANG: 'C.UTF-8' },
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    const stdout = []
    const stderr = []
    let bytes = 0
    const timer = setTimeout(() => child.kill('SIGKILL'), timeout)
    const collect = (target) => (chunk) => {
      bytes += chunk.length
      if (bytes > MAX_PROCESS_OUTPUT) {
        child.kill('SIGKILL')
        return
      }
      target.push(chunk)
    }
    child.stdout.on('data', collect(stdout))
    child.stderr.on('data', collect(stderr))
    child.on('error', (error) => {
      clearTimeout(timer)
      reject(error)
    })
    child.on('close', (code, signal) => {
      clearTimeout(timer)
      const output = Buffer.concat(stdout).toString('utf8')
      const errors = Buffer.concat(stderr).toString('utf8')
      if (bytes > MAX_PROCESS_OUTPUT) {
        reject(new Error(`${command} exceeded its output bound`))
      } else if (code !== 0) {
        reject(new Error(`${command} failed with ${signal ? `signal ${signal}` : `code ${code}`}: ${errors.slice(0, 2000)}`))
      } else {
        resolveCommand({ stderr: errors, stdout: output })
      }
    })
    if (input !== undefined) child.stdin.end(input)
    else child.stdin.end()
  })
}

function dockerEnvironment(extra = {}) {
  return {
    PATH: '/usr/bin:/bin',
    LANG: 'C.UTF-8',
    HOME: '/var/empty',
    ...extra,
  }
}

function composeArguments(modelPath, ...args) {
  return [
    'compose',
    '--project-name',
    'teal-docs-production',
    '--file',
    modelPath,
    ...args,
  ]
}

export function validateProductionComposeConfig(output, expectedImage) {
  let config
  try {
    config = JSON.parse(output)
  } catch {
    throw new Error('Resolved production Compose model is invalid JSON')
  }
  const hasExactKeys = (value, keys) => (
    value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort())
  )
  const rootShape = hasExactKeys(config, ['name', 'networks', 'services'])
  const servicesShape = hasExactKeys(config.services, ['docs'])
  const networkShape = hasExactKeys(config.networks, ['default'])
    && hasExactKeys(config.networks?.default, ['ipam', 'name'])
    && hasExactKeys(config.networks?.default?.ipam, [])
    && config.networks.default.name === 'teal-docs-production_default'
  const docs = config.services?.docs ?? {}
  const serviceShape = hasExactKeys(docs, [
    'cap_drop',
    'command',
    'cpus',
    'entrypoint',
    'healthcheck',
    'image',
    'logging',
    'mem_limit',
    'networks',
    'pids_limit',
    'ports',
    'read_only',
    'restart',
    'security_opt',
    'tmpfs',
    'user',
  ])
  const docsNetworkShape = hasExactKeys(docs.networks, ['default'])
    && docs.networks.default === null
  const ports = docs.ports ?? []
  const safePort = Array.isArray(ports)
    && ports.length === 1
    && hasExactKeys(ports[0], ['host_ip', 'mode', 'protocol', 'published', 'target'])
    && ports[0].mode === 'ingress'
    && String(ports[0].host_ip) === '127.0.0.1'
    && Number(ports[0].target) === 8080
    && Number(ports[0].published) === 8087
    && ports[0].protocol === 'tcp'
  const healthcheck = docs.healthcheck
  const safeHealthcheck = hasExactKeys(healthcheck, [
    'interval', 'retries', 'start_period', 'test', 'timeout',
  ]) && JSON.stringify(healthcheck.test) === JSON.stringify([
    'CMD',
    'wget',
    '-q',
    '-O',
    '/dev/null',
    'http://127.0.0.1:8080/healthz',
  ])
    && healthcheck.timeout === '3s'
    && healthcheck.interval === '10s'
    && healthcheck.retries === 6
    && healthcheck.start_period === '5s'
  const loggingShape = hasExactKeys(docs.logging, ['driver', 'options'])
    && hasExactKeys(docs.logging?.options, ['max-file', 'max-size'])
  if (
    !rootShape
    || config.name !== 'teal-docs-production'
    || !servicesShape
    || !networkShape
    || !serviceShape
    || !docsNetworkShape
    || docs.image !== expectedImage
    || docs.user !== '101:101'
    || docs.read_only !== true
    || docs.command !== null
    || docs.entrypoint !== null
    || !Array.isArray(docs.cap_drop)
    || JSON.stringify(docs.cap_drop) !== JSON.stringify(['ALL'])
    || !Array.isArray(docs.security_opt)
    || JSON.stringify(docs.security_opt) !== JSON.stringify(['no-new-privileges:true'])
    || docs.cpus !== 1
    || String(docs.mem_limit) !== '268435456'
    || docs.pids_limit !== 128
    || docs.restart !== 'unless-stopped'
    || JSON.stringify(docs.tmpfs) !== JSON.stringify([
      '/tmp:rw,noexec,nosuid,nodev,size=16m,mode=1777',
    ])
    || !loggingShape
    || docs.logging.driver !== 'json-file'
    || docs.logging?.options?.['max-size'] !== '10m'
    || docs.logging?.options?.['max-file'] !== '5'
    || !safeHealthcheck
    || !safePort
  ) {
    throw new Error('Resolved production Compose model violates the fixed runtime boundary')
  }
}

export function createHostAdapter({ stateRoot }) {
  const runDocker = (args, options = {}) => spawnFixed(DOCKER_EXECUTABLE, args, {
    ...options,
    env: dockerEnvironment(options.env),
  })
  const runtimeFacts = async ({ expectedImageId, imageDigest, modelPath }) => {
    const env = { TEAL_DOCS_IMAGE: imageDigest }
    const config = await runDocker(composeArguments(modelPath, 'config', '--format', 'json'), { env })
    validateProductionComposeConfig(config.stdout, imageDigest)
    const containerId = (await runDocker(composeArguments(modelPath, 'ps', '-q', 'docs'), { env })).stdout.trim()
    if (!/^[0-9a-f]{12,64}$/.test(containerId)) throw new Error('Compose returned an invalid docs container')
    const configuredImage = (await runDocker([
      'inspect', '--format', '{{.Config.Image}}', containerId,
    ])).stdout.trim()
    const runningImageId = (await runDocker([
      'inspect', '--format', '{{.Image}}', containerId,
    ])).stdout.trim()
    const health = (await runDocker([
      'inspect', '--format', '{{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}}', containerId,
    ])).stdout.trim()
    await spawnFixed(CURL_EXECUTABLE, [
      '--fail',
      '--show-error',
      '--silent',
      '--max-time',
      '5',
      '--retry',
      '12',
      '--retry-delay',
      '2',
      '--retry-connrefused',
      '--retry-all-errors',
      'http://127.0.0.1:8087/healthz',
    ], { env: dockerEnvironment(), timeout: 60_000 })
    if (runningImageId !== expectedImageId) {
      throw new Error('Running container differs from the expected image ID')
    }
    return { configuredImage, containerId, health, runningImageId }
  }

  return {
    async loadImage({ archivePath, imageId }) {
      await runDocker(['load', '--input', archivePath], { timeout: 600_000 })
      const loaded = (await runDocker(['image', 'inspect', imageId, '--format', '{{.Id}}'])).stdout.trim()
      if (loaded !== imageId) throw new Error('Loaded image ID differs from the approved image')
    },
    async verifyCandidate({ archivePath, imageId }) {
      const verificationRoot = join(
        stateRoot,
        `.candidate-verification-${process.pid}-${randomBytes(8).toString('hex')}`,
      )
      const cacheRoot = join(verificationRoot, 'trivy-cache')
      const containerName = `teal-docs-verification-${process.pid}-${randomBytes(6).toString('hex')}`
      await mkdir(verificationRoot, { mode: 0o700 })
      await mkdir(cacheRoot, { mode: 0o700 })
      const scannerArguments = (...arguments_) => [
        'run',
        '--rm',
        '--read-only',
        '--cap-drop',
        'ALL',
        '--security-opt',
        'no-new-privileges:true',
        '--pids-limit',
        '256',
        '--memory',
        '1g',
        '--cpus',
        '1',
        '--tmpfs',
        '/tmp:rw,nosuid,nodev,noexec,size=256m',
        '--mount',
        `type=bind,src=${archivePath},dst=/scan/image.tar,readonly`,
        '--mount',
        `type=bind,src=${cacheRoot},dst=/root/.cache`,
        TRIVY_IMAGE,
        'image',
        '--input',
        '/scan/image.tar',
        '--quiet',
        '--exit-code',
        '1',
        ...arguments_,
      ]
      try {
        await runDocker(scannerArguments(
          '--scanners',
          'vuln',
          '--severity',
          'HIGH,CRITICAL',
          '--ignore-unfixed',
        ), { timeout: 600_000 })
        await runDocker(scannerArguments(
          '--scanners',
          'secret',
        ), { timeout: 600_000 })

        const containerId = (await runDocker([
          'run',
          '--detach',
          '--name',
          containerName,
          '--read-only',
          '--user',
          '101:101',
          '--cap-drop',
          'ALL',
          '--security-opt',
          'no-new-privileges:true',
          '--pids-limit',
          '128',
          '--memory',
          '256m',
          '--cpus',
          '1',
          '--tmpfs',
          '/tmp:rw,noexec,nosuid,nodev,size=16m,mode=1777',
          '--publish',
          '127.0.0.1::8080',
          imageId,
        ], { timeout: 120_000 })).stdout.trim()
        if (!/^[0-9a-f]{64}$/.test(containerId)) {
          throw new Error('Fresh smoke test returned an invalid container ID')
        }
        const runningImageId = (await runDocker([
          'inspect', '--format', '{{.Image}}', containerId,
        ])).stdout.trim()
        if (runningImageId !== imageId) {
          throw new Error('Fresh smoke test used different image bytes')
        }
        const portOutput = (await runDocker(['port', containerId, '8080/tcp'])).stdout.trim()
        const portMatch = portOutput.match(/^127\.0\.0\.1:(\d+)$/)
        if (!portMatch) throw new Error('Fresh smoke test did not bind one loopback port')
        const origin = `http://127.0.0.1:${portMatch[1]}`
        await spawnFixed(CURL_EXECUTABLE, [
          '--fail',
          '--show-error',
          '--silent',
          '--max-time',
          '5',
          '--retry',
          '12',
          '--retry-delay',
          '2',
          '--retry-connrefused',
          '--retry-all-errors',
          `${origin}/healthz`,
        ], { env: dockerEnvironment(), timeout: 60_000 })
        const headers = (await spawnFixed(CURL_EXECUTABLE, [
          '--fail',
          '--show-error',
          '--silent',
          '--max-time',
          '5',
          '--dump-header',
          '-',
          '--output',
          '/dev/null',
          `${origin}/`,
        ], { env: dockerEnvironment() })).stdout.toLowerCase()
        for (const header of [
          'content-security-policy:',
          'permissions-policy:',
          'referrer-policy:',
          'x-content-type-options:',
        ]) {
          if (!headers.includes(`\n${header}`)) {
            throw new Error(`Fresh smoke test is missing ${header.slice(0, -1)}`)
          }
        }
      } finally {
        await runDocker(['rm', '--force', containerName]).catch(() => undefined)
        await rm(verificationRoot, { recursive: true, force: true })
      }
    },
    async publishImage({
      candidateSha256,
      imageId,
      repository,
      registryToken,
      registryUser,
      sourceCommit,
    }) {
      const session = join(
        stateRoot,
        `.registry-session-${process.pid}-${randomBytes(8).toString('hex')}`,
      )
      await mkdir(session, { mode: 0o700 })
      const env = { DOCKER_CONFIG: session }
      const tag = `${repository}:${sourceCommit}-${candidateSha256.slice('sha256:'.length, 'sha256:'.length + 12)}`
      try {
        await runDocker([
          'login', 'ghcr.io', '--username', registryUser, '--password-stdin',
        ], { env, input: registryToken })
        await runDocker(['tag', imageId, tag], { env })
        const pushed = await runDocker(['push', tag], { env, timeout: 600_000 })
        const matches = `${pushed.stdout}\n${pushed.stderr}`.match(/digest:\s+(sha256:[0-9a-f]{64})/g) ?? []
        if (matches.length !== 1) throw new Error('Registry push did not return one immutable digest')
        const digest = matches[0].match(/sha256:[0-9a-f]{64}/)[0]
        const immutable = `${repository}@${digest}`
        await runDocker(['pull', immutable], { env, timeout: 600_000 })
        const pulled = (await runDocker(['image', 'inspect', immutable, '--format', '{{.Id}}'], { env })).stdout.trim()
        if (pulled !== imageId) throw new Error('Pushed repository digest differs from the approved image ID')
        return immutable
      } finally {
        await runDocker(['logout', 'ghcr.io'], { env }).catch(() => undefined)
        await rm(session, { recursive: true, force: true })
      }
    },
    async rollout({ expectedImageId, imageDigest, modelPath }) {
      const env = { TEAL_DOCS_IMAGE: imageDigest }
      const config = await runDocker(composeArguments(modelPath, 'config', '--format', 'json'), { env })
      validateProductionComposeConfig(config.stdout, imageDigest)
      await runDocker(
        composeArguments(modelPath, 'up', '-d', '--no-build', '--wait', 'docs'),
        { env, timeout: 180_000 },
      )
      await runtimeFacts({ expectedImageId, imageDigest, modelPath })
    },
    observe: runtimeFacts,
    async stop({ modelPath }) {
      const env = { TEAL_DOCS_IMAGE: `${PRODUCTION_REPOSITORY}@sha256:${'0'.repeat(64)}` }
      await runDocker(composeArguments(modelPath, 'stop', 'docs'), { env })
      const running = (await runDocker(
        composeArguments(modelPath, 'ps', '--status', 'running', '-q', 'docs'),
        { env },
      )).stdout.trim()
      if (running) throw new Error('Failed first docs deployment remains running')
    },
  }
}

async function trustedRootFile(path, requiredOwnerUid, allowedModes, maximumBytes = MAX_JSON_BYTES) {
  const absolute = resolve(path)
  const metadata = await lstat(absolute)
  if (
    !metadata.isFile()
    || metadata.isSymbolicLink()
    || await realpath(absolute) !== absolute
    || metadata.uid !== requiredOwnerUid
    || !allowedModes.includes(metadata.mode & 0o777)
  ) {
    throw new Error(`Trusted controller input has unsafe ownership or mode: ${path}`)
  }
  return stableFile(absolute, maximumBytes)
}

function deploymentArguments(args) {
  const valueNames = new Set([
    '--candidate-root',
    '--candidate-sha256',
    '--source-commit',
    '--source-run-id',
    '--source-run-attempt',
    '--approval-manifest',
    '--approval-digest',
    '--approval-signature',
    '--registry-user',
  ])
  const values = new Map()
  let tokenStdin = false
  for (let index = 0; index < args.length;) {
    const name = args[index]
    if (name === '--registry-token-stdin') {
      if (tokenStdin) throw new Error('Controller arguments are invalid')
      tokenStdin = true
      index += 1
      continue
    }
    const value = args[index + 1]
    if (!valueNames.has(name) || !value || values.has(name)) {
      throw new Error('Controller arguments are invalid')
    }
    values.set(name, value)
    index += 2
  }
  if (values.size !== valueNames.size || !tokenStdin) {
    throw new Error('Controller deployment arguments are incomplete')
  }
  return values
}

async function stdinToken() {
  const chunks = []
  let bytes = 0
  for await (const chunk of process.stdin) {
    bytes += chunk.length
    if (bytes > 4096) throw new Error('Registry token exceeds its byte bound')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

async function commandMain(args) {
  if (process.getuid?.() !== 0) throw new Error('Production controller must run as root')
  if (process.env.KRYV_TEAL_CONTROLLER_LOCKED !== '1') {
    throw new Error(`Production controller must run through ${FLOCK_EXECUTABLE}`)
  }
  const stateRoot = PRODUCTION_STATE_ROOT
  const ledgerRoot = CONSUMED_APPROVALS_ROOT
  const generationRoot = '/usr/local/share/kryv-teal-production/current'
  const publicKeyPath = `${generationRoot}/config/owner.pub.pem`
  const trustAnchorPath = `${generationRoot}/config/release-owner-approval.json`
  const controllerDigestPath = `${generationRoot}/controller-archive.sha256`
  const requiredOwnerUid = 0

  if (args[0] === 'observe' && args.length === 1) {
    const adapter = createHostAdapter({ stateRoot })
    await recoverProductionTransaction({ adapter, requiredOwnerUid, stateRoot })
    const release = await readCurrentRelease(stateRoot, requiredOwnerUid)
    if (!release) throw new Error('No retained production release exists')
    await recordProductionObservation({
      adapter,
      release,
      requiredOwnerUid,
      stateRoot,
    })
    process.stdout.write(`Observed healthy Teal production candidate ${release.candidateSha256}\n`)
    return
  }
  if (args[0] !== 'deploy') throw new Error('Usage: controller <deploy|observe>')
  const options = deploymentArguments(args.slice(1))
  const [approvalManifestBytes, publicKeyPem, trustAnchorBytes, controllerDigestBytes, registryToken] = await Promise.all([
    stableFile(options.get('--approval-manifest'), 1024 * 1024),
    trustedRootFile(publicKeyPath, requiredOwnerUid, [0o400]),
    trustedRootFile(trustAnchorPath, requiredOwnerUid, [0o400, 0o444]),
    trustedRootFile(controllerDigestPath, requiredOwnerUid, [0o400, 0o444], 256),
    stdinToken(),
  ])
  let trustAnchor
  try {
    trustAnchor = JSON.parse(trustAnchorBytes.toString('utf8'))
  } catch {
    throw new Error('Installed owner trust anchor is invalid JSON')
  }
  const controllerArchiveSha256 = controllerDigestBytes.toString('utf8').trim()
  const sourceRunAttempt = Number(options.get('--source-run-attempt'))
  const expectedContext = {
    candidateSha256: options.get('--candidate-sha256'),
    environment: 'teal-production',
    ref: 'refs/heads/master',
    repository: 'platypus27/teal',
    sourceCommit: options.get('--source-commit'),
    sourceRunAttempt,
    sourceRunId: options.get('--source-run-id'),
    workflow: 'platypus27/teal/.github/workflows/protected-release.yml',
  }
  const result = await deployProductionCandidate({
    adapter: createHostAdapter({ stateRoot }),
    approvalDigest: options.get('--approval-digest'),
    approvalManifestBytes,
    approvalSignature: options.get('--approval-signature'),
    candidateRoot: options.get('--candidate-root'),
    controllerArchiveSha256,
    expectedContext,
    ledgerRoot,
    publicKeyPem,
    registryToken,
    registryUser: options.get('--registry-user'),
    requiredOwnerUid,
    stateRoot,
    trustAnchorBytes,
    trustedFingerprint: trustAnchor.publicKeyFingerprint,
  })
  process.stdout.write(`Deployed and observed Teal production candidate ${result.release.candidateSha256}\n`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await commandMain(process.argv.slice(2))
  } catch (error) {
    process.stderr.write(`Teal production controller failed: ${error.message}\n`)
    process.exitCode = 1
  }
}
