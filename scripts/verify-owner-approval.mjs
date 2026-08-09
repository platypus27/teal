import { lstat, readFile, realpath } from 'node:fs/promises'
import { resolve } from 'node:path'

import {
  assertApprovedArtifact,
  verifyOwnerApproval,
} from './owner-approval.mjs'

const MAX_INPUT_BYTES = 1024 * 1024

function parseArguments(args) {
  const values = new Map()
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index]
    const value = args[index + 1]
    if (
      ![
        '--manifest',
        '--descriptor',
        '--digest',
        '--signature',
        '--public-key',
        '--trust-anchor',
        '--operation',
        '--candidate-sha256',
        '--repository',
        '--environment',
        '--workflow',
        '--ref',
        '--source-commit',
        '--source-run-attempt',
        '--source-run-id',
        '--verification-mode',
      ].includes(name)
      || !value
      || value.startsWith('-')
      || values.has(name)
    ) {
      throw new Error('Usage: verify-owner-approval.mjs --manifest <json> --descriptor <json> --digest <sha256> --signature <base64> --public-key <pem> --trust-anchor <json> --operation <npm-publish|docs-deploy> --candidate-sha256 <sha256> --repository <owner/repository> --environment <name> --workflow <owner/repository/workflow> --ref <protected-ref> --source-commit <commit> --source-run-attempt <number> --source-run-id <id>')
    }
    values.set(name, value)
  }
  const verificationMode = values.get('--verification-mode') ?? 'fresh'
  if (
    ![15, 16].includes(values.size)
    || !['npm-publish', 'docs-deploy'].includes(values.get('--operation'))
    || !['fresh', 'durable-recovery'].includes(verificationMode)
  ) {
    throw new Error('Owner approval arguments are incomplete')
  }
  values.set('--verification-mode', verificationMode)
  return Object.fromEntries([...values].map(([name, value]) => [name.slice(2), value]))
}

async function readBoundedRegularFile(path, label) {
  const absolute = resolve(path)
  const metadata = await lstat(absolute)
  if (
    !metadata.isFile()
    || metadata.isSymbolicLink()
    || metadata.size === 0
    || metadata.size > MAX_INPUT_BYTES
    || await realpath(absolute) !== absolute
  ) {
    throw new Error(`${label} must be a bounded canonical regular file`)
  }
  return readFile(absolute)
}

try {
  const options = parseArguments(process.argv.slice(2))
  const [manifestBytes, descriptorBytes, publicKeyPem, trustAnchorBytes] = await Promise.all([
    readBoundedRegularFile(options.manifest, 'Approval manifest'),
    readBoundedRegularFile(options.descriptor, 'Artifact descriptor'),
    readBoundedRegularFile(options['public-key'], 'Owner public key'),
    readBoundedRegularFile(options['trust-anchor'], 'Owner trust anchor'),
  ])
  const trustAnchor = JSON.parse(trustAnchorBytes.toString('utf8'))
  const expectedTrustFields = [
    'algorithm',
    'operationEnvironments',
    'owner',
    'publicKeyFingerprint',
    'ref',
    'repository',
    'schemaVersion',
    'workflow',
  ]
  if (
    trustAnchor?.schemaVersion !== 2
    || trustAnchor.algorithm !== 'Ed25519'
    || trustAnchor.owner !== 'kryv-owner'
    || !/^sha256:[0-9a-f]{64}$/.test(trustAnchor.publicKeyFingerprint)
    || JSON.stringify(Object.keys(trustAnchor).sort()) !== JSON.stringify(expectedTrustFields)
    || trustAnchor.repository !== options.repository
    || trustAnchor.workflow !== options.workflow
    || trustAnchor.ref !== options.ref
    || trustAnchor.operationEnvironments?.[options.operation] !== options.environment
    || Object.keys(trustAnchor.operationEnvironments ?? {}).length !== 2
  ) {
    throw new Error('Owner trust anchor is not configured')
  }
  const approval = verifyOwnerApproval({
    enforceValidity: options['verification-mode'] === 'fresh',
    expectedDigest: options.digest,
    manifestBytes,
    publicKeyPem,
    signature: options.signature,
    trustedFingerprint: trustAnchor.publicKeyFingerprint,
    expectedContext: {
      repository: options.repository,
      environment: options.environment,
      workflow: options.workflow,
      ref: options.ref,
      sourceCommit: options['source-commit'],
      sourceRunId: options['source-run-id'],
      sourceRunAttempt: Number(options['source-run-attempt']),
      candidateSha256: options['candidate-sha256'],
    },
  })
  if (approval.manifest.operation !== options.operation) {
    throw new Error('Owner approval operation mismatch')
  }
  const descriptor = JSON.parse(descriptorBytes.toString('utf8'))
  assertApprovedArtifact(approval.manifest, descriptor)
  process.stdout.write(`Owner approval verified for ${approval.digest}\n`)
} catch (error) {
  process.stderr.write(`Owner approval failed: ${error.message}\n`)
  process.exitCode = 1
}
