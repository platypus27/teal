import { createHash } from 'node:crypto'
import { constants } from 'node:fs'
import { lstat, open, realpath } from 'node:fs/promises'
import { join, resolve } from 'node:path'

import {
  assertApprovedArtifact,
  verifyOwnerApproval,
} from './owner-approval.mjs'

const LEDGER_MODE = 0o700
const RECORD_MODE = 0o600

function currentTime(clock) {
  if (typeof clock !== 'function') throw new Error('Owner authority clock is required')
  const now = clock()
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) {
    throw new Error('Owner authority clock returned an invalid time')
  }
  return now
}

function assertCurrentApproval(manifest, now) {
  const createdAt = new Date(manifest.createdAt).getTime()
  const expiresAt = new Date(manifest.expiresAt).getTime()
  if (now.getTime() < createdAt || now.getTime() > expiresAt) {
    throw new Error('Owner approval is outside its validity window')
  }
}

async function trustedLedgerRoot(path, requiredOwnerUid) {
  const absolute = resolve(path)
  const metadata = await lstat(absolute)
  if (
    !metadata.isDirectory()
    || metadata.isSymbolicLink()
    || await realpath(absolute) !== absolute
    || metadata.uid !== requiredOwnerUid
    || (metadata.mode & 0o777) !== LEDGER_MODE
  ) {
    throw new Error('Owner approval ledger must be a canonical owner-controlled mode-0700 directory')
  }
  return absolute
}

async function writeAll(handle, bytes) {
  let offset = 0
  while (offset < bytes.length) {
    const { bytesWritten } = await handle.write(bytes, offset, bytes.length - offset, offset)
    if (!Number.isInteger(bytesWritten) || bytesWritten < 1) {
      throw new Error('Owner approval replay record write made no progress')
    }
    offset += bytesWritten
  }
}

async function consumeRecord({ digest, ledgerRoot, record, requiredOwnerUid }) {
  const name = `${digest.slice('sha256:'.length)}.json`
  const path = join(ledgerRoot, name)
  const bytes = Buffer.from(`${JSON.stringify(record, null, 2)}\n`)
  let handle
  try {
    handle = await open(
      path,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
      RECORD_MODE,
    )
  } catch (error) {
    if (error?.code === 'EEXIST') throw new Error('Owner approval was already consumed; replay rejected')
    throw error
  }
  try {
    await writeAll(handle, bytes)
    await handle.sync()
    const metadata = await handle.stat()
    if (
      !metadata.isFile()
      || metadata.uid !== requiredOwnerUid
      || (metadata.mode & 0o777) !== RECORD_MODE
      || metadata.size !== bytes.length
    ) {
      throw new Error('Owner approval replay record publication is invalid')
    }
  } finally {
    await handle.close()
  }

  const directory = await open(
    ledgerRoot,
    constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW,
  )
  try {
    await directory.sync()
  } finally {
    await directory.close()
  }
  return path
}

export async function authorizeAndConsumeOwnerApproval({
  clock = () => new Date(),
  descriptor,
  digest,
  expectedContext,
  ledgerRoot,
  manifestBytes,
  publicKeyPem,
  requiredOwnerUid = 0,
  signature,
  trustedFingerprint,
}) {
  const verified = verifyOwnerApproval({
    expectedDigest: digest,
    expectedContext,
    manifestBytes,
    now: currentTime(clock),
    publicKeyPem,
    signature,
    trustedFingerprint,
  })
  assertApprovedArtifact(verified.manifest, descriptor)
  const expectedOperation = expectedContext?.environment === 'teal-production'
    ? 'docs-deploy'
    : expectedContext?.environment === 'teal-release'
      ? 'npm-publish'
      : undefined
  if (!expectedOperation || verified.manifest.operation !== expectedOperation) {
    throw new Error('Owner approval operation mismatch')
  }

  const trustedRoot = await trustedLedgerRoot(ledgerRoot, requiredOwnerUid)
  const consumedAt = currentTime(clock)
  assertCurrentApproval(verified.manifest, consumedAt)
  const nonceSha256 = `sha256:${createHash('sha256')
    .update(Buffer.from(verified.manifest.nonce, 'base64'))
    .digest('hex')}`
  const record = {
    schemaVersion: 1,
    approvalDigest: verified.digest,
    operation: verified.manifest.operation,
    consumedAt: consumedAt.toISOString(),
    candidateSha256: verified.manifest.candidateSha256,
    sourceCommit: verified.manifest.sourceCommit,
    sourceRunId: verified.manifest.sourceRunId,
    sourceRunAttempt: verified.manifest.sourceRunAttempt,
    nonceSha256,
  }
  const replayRecord = await consumeRecord({
    digest: verified.digest,
    ledgerRoot: trustedRoot,
    record,
    requiredOwnerUid,
  })
  return {
    ...verified,
    replayRecord,
  }
}
