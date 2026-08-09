import assert from 'node:assert/strict'
import { generateKeyPairSync, sign } from 'node:crypto'
import {
  chmod,
  access,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import {
  APPROVAL_CONTEXT,
  approvalDigest,
  approvalPublicKey,
  canonicalApprovalManifest,
} from '../scripts/owner-approval.mjs'
import {
  deployProductionCandidate,
  observeProductionRelease,
  recordProductionObservation,
  recoverProductionTransaction,
  validateProductionComposeConfig,
} from '../scripts/kryv_teal_production_controller.mjs'
import {
  createCandidateManifest,
  sha256Bytes,
} from '../scripts/teal_release_candidate.mjs'

const sourceCommit = '1'.repeat(40)
const sourceRunId = '1234567890123456789'
const sourceRunAttempt = 2
const imageId = `sha256:${'2'.repeat(64)}`
const repository = 'ghcr.io/platypus27/teal/teal-docs'
const now = new Date('2026-08-07T12:00:00.000Z')
const { privateKey, publicKey } = generateKeyPairSync('ed25519')
const publicKeyPem = publicKey.export({ format: 'pem', type: 'spki' })
const trustedFingerprint = approvalPublicKey(publicKeyPem).fingerprint

async function writeJson(path, value) {
  const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`)
  await writeFile(path, bytes, { mode: 0o444 })
  return bytes
}

async function candidateFixture(t, suffix = '') {
  const fixtureRoot = await mkdtemp(join(tmpdir(), `teal-controller-${suffix}`))
  const candidateRoot = join(fixtureRoot, 'candidate')
  const stateRoot = join(fixtureRoot, 'state')
  const ledgerRoot = join(stateRoot, 'consumed-approvals')
  await Promise.all([
    mkdir(candidateRoot, { mode: 0o700 }),
    mkdir(stateRoot, { mode: 0o700 }),
  ])
  await mkdir(ledgerRoot, { mode: 0o700 })
  for (const directory of ['controller', 'docs', 'infra', 'npm', 'runtime', 'source']) {
    await mkdir(join(candidateRoot, directory), { mode: 0o700 })
  }

  const archiveBytes = Buffer.from(`exact-image-${suffix || 'one'}`)
  const archiveSha256 = sha256Bytes(archiveBytes)
  await writeFile(join(candidateRoot, 'docs/docs-image.tar'), archiveBytes, { mode: 0o444 })

  const rawReport = {
    SchemaVersion: 2,
    ArtifactType: 'container_image',
    Metadata: { ImageID: imageId },
    Results: [],
  }
  const reportSha256 = sha256Bytes(Buffer.from(`${JSON.stringify(rawReport, null, 2)}\n`))
  const receipt = (scanType) => ({
    schemaVersion: 1,
    status: 'passed',
    scanType,
    scanner: { name: 'trivy', version: '0.73.0' },
    sourceCommit,
    repository,
    imageId,
    archiveSha256,
    reportSha256,
    report: rawReport,
  })
  const vulnerabilityBytes = await writeJson(
    join(candidateRoot, 'docs/docs-image.vulnerability.json'),
    receipt('vulnerability'),
  )
  const secretBytes = await writeJson(
    join(candidateRoot, 'docs/docs-image.secret.json'),
    receipt('secret'),
  )
  const sbom = {
    bomFormat: 'CycloneDX',
    specVersion: '1.6',
    version: 1,
    metadata: {
      component: {
        type: 'container',
        properties: [{ name: 'aquasecurity:trivy:ImageID', value: imageId }],
      },
      properties: [
        { name: 'org.kryv.teal.image-id', value: imageId },
        { name: 'org.kryv.teal.archive-sha256', value: archiveSha256 },
        { name: 'org.kryv.teal.source-commit', value: sourceCommit },
        { name: 'org.kryv.teal.repository', value: repository },
      ],
    },
  }
  const sbomBytes = await writeJson(join(candidateRoot, 'docs/docs-image.sbom.cdx.json'), sbom)
  const descriptor = {
    schemaVersion: 2,
    sourceCommit,
    repository,
    imageId,
    archive: 'docs-image.tar',
    archiveSha256,
    sbom: 'docs-image.sbom.cdx.json',
    sbomSha256: sha256Bytes(sbomBytes),
    vulnerabilityReceipt: 'docs-image.vulnerability.json',
    vulnerabilityReceiptSha256: sha256Bytes(vulnerabilityBytes),
    secretReceipt: 'docs-image.secret.json',
    secretReceiptSha256: sha256Bytes(secretBytes),
  }
  await writeJson(join(candidateRoot, 'docs/artifact.json'), descriptor)

  const controllerArchive = Buffer.from('fixed-controller-archive')
  const trustAnchorBytes = Buffer.from(`${JSON.stringify({
    schemaVersion: 2,
    algorithm: 'Ed25519',
    owner: 'kryv-owner',
    publicKeyFingerprint: trustedFingerprint,
    repository: 'platypus27/teal',
    workflow: 'platypus27/teal/.github/workflows/protected-release.yml',
    ref: 'refs/heads/master',
    operationEnvironments: {
      'npm-publish': 'teal-release',
      'docs-deploy': 'teal-production',
    },
  }, null, 2)}\n`)
  await Promise.all([
    writeFile(
      join(candidateRoot, 'controller/kryv-teal-production-controller.tar'),
      controllerArchive,
      { mode: 0o444 },
    ),
    writeFile(join(candidateRoot, 'deploy.docs.yml'), 'services:\n  docs:\n    image: ${TEAL_DOCS_IMAGE}\n', { mode: 0o444 }),
    writeFile(join(candidateRoot, 'npm/artifact.json'), '{}\n', { mode: 0o444 }),
    writeFile(join(candidateRoot, 'npm/kryv-teal-0.5.1.tgz'), 'npm\n', { mode: 0o444 }),
    writeFile(join(candidateRoot, 'source/repository.bundle'), 'bundle\n', { mode: 0o444 }),
    writeFile(join(candidateRoot, 'infra/release-owner-approval.json'), trustAnchorBytes, { mode: 0o444 }),
    ...[
      'owner-approval.mjs',
      'publish-candidate-package.mjs',
      'reconcile-candidate-release.mjs',
      'teal_release_candidate.mjs',
      'teal_owner_authority.mjs',
      'verify-owner-approval.mjs',
    ].map((name) => writeFile(join(candidateRoot, 'runtime', name), 'export {}\n', { mode: 0o444 })),
  ])

  const candidate = await createCandidateManifest({
    context: {
      repository: 'platypus27/teal',
      workflow: 'platypus27/teal/.github/workflows/pipeline.yml',
      ref: 'refs/heads/master',
      sourceCommit,
      sourceRunId,
      sourceRunAttempt,
      createdAt: '2026-08-07T11:50:00.000Z',
    },
    root: candidateRoot,
  })
  const expectedContext = {
    candidateSha256: candidate.manifestSha256,
    environment: 'teal-production',
    ref: 'refs/heads/master',
    repository: 'platypus27/teal',
    sourceCommit,
    sourceRunAttempt,
    sourceRunId,
    workflow: 'platypus27/teal/.github/workflows/protected-release.yml',
  }
  const approvalManifest = {
    schemaVersion: 3,
    decision: 'approve',
    owner: 'kryv-owner',
    operation: 'docs-deploy',
    mutations: ['registry-push', 'production-deploy'],
    approvalReference: `controller-test-${suffix || 'one'}`,
    nonce: Buffer.alloc(32, suffix ? 8 : 7).toString('base64'),
    createdAt: '2026-08-07T11:55:00.000Z',
    expiresAt: '2026-08-07T12:10:00.000Z',
    ...expectedContext,
    artifact: {
      imageId,
      archiveSha256,
      repository,
    },
  }
  const approvalManifestBytes = canonicalApprovalManifest(approvalManifest)
  const digest = approvalDigest(approvalManifestBytes)
  const signature = sign(
    null,
    Buffer.from(`${APPROVAL_CONTEXT}${digest}\n`),
    privateKey,
  ).toString('base64')
  t.after(() => rm(fixtureRoot, { recursive: true, force: true }))
  return {
    approval: { digest, manifestBytes: approvalManifestBytes, signature },
    candidateRoot,
    controllerArchiveSha256: sha256Bytes(controllerArchive),
    descriptor,
    expectedContext,
    ledgerRoot,
    stateRoot,
    trustAnchorBytes,
  }
}

function adapter({ failRollout = false, failVerification = false } = {}) {
  const calls = []
  return {
    calls,
    async loadImage(input) {
      calls.push(['load', input.imageId])
    },
    async verifyCandidate(input) {
      calls.push(['verify', input.imageId])
      if (failVerification) throw new Error('simulated fresh candidate verification failure')
    },
    async publishImage(input) {
      calls.push(['publish', input.imageId])
      return `${input.repository}@sha256:${'9'.repeat(64)}`
    },
    async rollout(input) {
      calls.push(['rollout', input.imageDigest])
      if (failRollout) throw new Error('simulated rollout failure')
    },
    async stop(input) {
      calls.push(['stop', input.modelPath])
    },
    async observe(input) {
      calls.push(['observe', input.imageDigest])
      return {
        containerId: 'a'.repeat(64),
        configuredImage: input.imageDigest,
        runningImageId: input.expectedImageId,
        health: 'healthy',
      }
    },
  }
}

test('consumes one exact approval before publishing and atomically records an observed release', async (t) => {
  const fixture = await candidateFixture(t)
  const host = adapter()
  const deploy = () => deployProductionCandidate({
    ...fixture,
    adapter: host,
    approvalDigest: fixture.approval.digest,
    approvalManifestBytes: fixture.approval.manifestBytes,
    approvalSignature: fixture.approval.signature,
    clock: () => now,
    publicKeyPem,
    registryToken: 'test-token',
    registryUser: 'github-actions',
    requiredOwnerUid: process.getuid(),
    trustedFingerprint,
  })

  const result = await deploy()
  assert.equal(result.release.candidateSha256, fixture.expectedContext.candidateSha256)
  assert.equal(result.observation.status, 'healthy')
  assert.deepEqual(host.calls.map(([name]) => name), ['load', 'verify', 'publish', 'rollout', 'observe'])
  const retained = JSON.parse(await readFile(join(fixture.stateRoot, 'current-release.json'), 'utf8'))
  assert.equal(retained.imageId, imageId)
  assert.equal(retained.imageDigest, `${repository}@sha256:${'9'.repeat(64)}`)
  await assert.rejects(access(join(fixture.stateRoot, 'deployment-transaction.json')), /ENOENT/)
  await assert.rejects(deploy(), /already consumed|replay/i)
  assert.equal(host.calls.filter(([name]) => name === 'publish').length, 1)
})

test('fresh archive scan and smoke must pass immediately before approval and registry push', async (t) => {
  const fixture = await candidateFixture(t, 'fresh-verification-')
  const blocked = adapter({ failVerification: true })
  const deploy = (host) => deployProductionCandidate({
    ...fixture,
    adapter: host,
    approvalDigest: fixture.approval.digest,
    approvalManifestBytes: fixture.approval.manifestBytes,
    approvalSignature: fixture.approval.signature,
    clock: () => now,
    publicKeyPem,
    registryToken: 'test-token',
    registryUser: 'github-actions',
    requiredOwnerUid: process.getuid(),
    trustedFingerprint,
  })

  await assert.rejects(deploy(blocked), /fresh candidate verification failure/)
  assert.deepEqual(blocked.calls.map(([name]) => name), ['load', 'verify'])

  const retry = adapter()
  await deploy(retry)
  assert.deepEqual(retry.calls.map(([name]) => name), ['load', 'verify', 'publish', 'rollout', 'observe'])
})

test('recovers a persisted rollout transaction by conservatively restoring the prior release', async (t) => {
  const first = await candidateFixture(t, 'journal-first-')
  await deployProductionCandidate({
    ...first,
    adapter: adapter(),
    approvalDigest: first.approval.digest,
    approvalManifestBytes: first.approval.manifestBytes,
    approvalSignature: first.approval.signature,
    clock: () => now,
    publicKeyPem,
    registryToken: 'test-token',
    registryUser: 'github-actions',
    requiredOwnerUid: process.getuid(),
    trustedFingerprint,
  })
  const previousRelease = JSON.parse(await readFile(join(first.stateRoot, 'current-release.json'), 'utf8'))
  const targetDigest = `sha256:${'8'.repeat(64)}`
  const targetRoot = join(first.stateRoot, 'releases', targetDigest.slice('sha256:'.length))
  await mkdir(targetRoot, { recursive: true, mode: 0o700 })
  const targetRelease = {
    ...previousRelease,
    candidateSha256: targetDigest,
    imageDigest: `${repository}@sha256:${'7'.repeat(64)}`,
    modelPath: join(targetRoot, 'deploy.docs.yml'),
    previousCandidateSha256: previousRelease.candidateSha256,
  }
  await writeFile(join(first.stateRoot, 'deployment-transaction.json'), `${JSON.stringify({
    schemaVersion: 1,
    phase: 'rollout-started',
    approvalDigest: `sha256:${'6'.repeat(64)}`,
    previousRelease,
    targetRelease,
    updatedAt: now.toISOString(),
  }, null, 2)}\n`, { mode: 0o600 })

  const host = adapter()
  const recovered = await recoverProductionTransaction({
    adapter: host,
    clock: () => now,
    requiredOwnerUid: process.getuid(),
    stateRoot: first.stateRoot,
  })

  assert.equal(recovered.status, 'recovered')
  assert.deepEqual(host.calls.map(([name]) => name), ['rollout', 'observe'])
  assert.deepEqual(
    JSON.parse(await readFile(join(first.stateRoot, 'current-release.json'), 'utf8')),
    previousRelease,
  )
  await assert.rejects(access(join(first.stateRoot, 'deployment-transaction.json')), /ENOENT/)
})

test('records an unhealthy observation instead of leaving stale healthy evidence', async (t) => {
  const fixture = await candidateFixture(t, 'observation-failure-')
  const release = {
    schemaVersion: 1,
    candidateSha256: fixture.expectedContext.candidateSha256,
    sourceCommit,
    sourceRunId,
    sourceRunAttempt,
    imageId,
    imageDigest: `${repository}@sha256:${'9'.repeat(64)}`,
    modelPath: join(
      fixture.stateRoot,
      'releases',
      fixture.expectedContext.candidateSha256.slice('sha256:'.length),
      'deploy.docs.yml',
    ),
    deployedAt: now.toISOString(),
    previousCandidateSha256: null,
  }
  await writeFile(join(fixture.stateRoot, 'observation.json'), '{"status":"healthy"}\n', { mode: 0o600 })
  await assert.rejects(
    recordProductionObservation({
      adapter: {
        observe: async () => ({
          containerId: 'a'.repeat(64),
          configuredImage: release.imageDigest,
          runningImageId: `sha256:${'0'.repeat(64)}`,
          health: 'healthy',
        }),
      },
      clock: () => now,
      release,
      requiredOwnerUid: process.getuid(),
      stateRoot: fixture.stateRoot,
    }),
    /runtime image identity drift/i,
  )
  const observation = JSON.parse(await readFile(join(fixture.stateRoot, 'observation.json'), 'utf8'))
  assert.equal(observation.status, 'unhealthy')
  assert.equal(observation.candidateSha256, release.candidateSha256)
  assert.match(observation.error, /runtime image identity drift/i)
})

test('rollout failure preserves the prior current release and verifies rollback', async (t) => {
  const first = await candidateFixture(t, 'first-')
  const initialAdapter = adapter()
  await deployProductionCandidate({
    ...first,
    adapter: initialAdapter,
    approvalDigest: first.approval.digest,
    approvalManifestBytes: first.approval.manifestBytes,
    approvalSignature: first.approval.signature,
    clock: () => now,
    publicKeyPem,
    registryToken: 'test-token',
    registryUser: 'github-actions',
    requiredOwnerUid: process.getuid(),
    trustedFingerprint,
  })
  const before = await readFile(join(first.stateRoot, 'current-release.json'))

  const second = await candidateFixture(t, 'second-')
  const failing = adapter({ failRollout: true })
  let rolloutCount = 0
  failing.rollout = async (input) => {
    failing.calls.push(['rollout', input.imageDigest])
    rolloutCount += 1
    if (rolloutCount === 1) throw new Error('simulated rollout failure')
  }

  await assert.rejects(
    deployProductionCandidate({
      ...second,
      ledgerRoot: first.ledgerRoot,
      stateRoot: first.stateRoot,
      adapter: failing,
      approvalDigest: second.approval.digest,
      approvalManifestBytes: second.approval.manifestBytes,
      approvalSignature: second.approval.signature,
      clock: () => now,
      publicKeyPem,
      registryToken: 'test-token',
      registryUser: 'github-actions',
      requiredOwnerUid: process.getuid(),
      trustedFingerprint,
    }),
    /rollout failure/i,
  )
  assert.deepEqual(await readFile(join(first.stateRoot, 'current-release.json')), before)
  assert.equal(failing.calls.filter(([name]) => name === 'rollout').length, 2)
  assert.equal(failing.calls.filter(([name]) => name === 'observe').length, 2)
})

test('rejects an unhealthy retained rollback target before consuming approval or mutating images', async (t) => {
  const first = await candidateFixture(t, 'healthy-')
  await deployProductionCandidate({
    ...first,
    adapter: adapter(),
    approvalDigest: first.approval.digest,
    approvalManifestBytes: first.approval.manifestBytes,
    approvalSignature: first.approval.signature,
    clock: () => now,
    publicKeyPem,
    registryToken: 'test-token',
    registryUser: 'github-actions',
    requiredOwnerUid: process.getuid(),
    trustedFingerprint,
  })

  const second = await candidateFixture(t, 'preflight-')
  const drifted = adapter()
  drifted.observe = async (input) => {
    drifted.calls.push(['observe', input.imageDigest])
    return {
      containerId: 'a'.repeat(64),
      configuredImage: input.imageDigest,
      runningImageId: `sha256:${'8'.repeat(64)}`,
      health: 'healthy',
    }
  }

  await assert.rejects(
    deployProductionCandidate({
      ...second,
      ledgerRoot: first.ledgerRoot,
      stateRoot: first.stateRoot,
      adapter: drifted,
      approvalDigest: second.approval.digest,
      approvalManifestBytes: second.approval.manifestBytes,
      approvalSignature: second.approval.signature,
      clock: () => now,
      publicKeyPem,
      registryToken: 'test-token',
      registryUser: 'github-actions',
      requiredOwnerUid: process.getuid(),
      trustedFingerprint,
    }),
    /runtime image identity drift/i,
  )
  assert.deepEqual(drifted.calls.map(([name]) => name), ['observe'])
})

test('observation fails closed when runtime identity drifts from retained state', async () => {
  const state = {
    schemaVersion: 1,
    candidateSha256: `sha256:${'a'.repeat(64)}`,
    sourceCommit,
    sourceRunId,
    sourceRunAttempt,
    imageId,
    imageDigest: `${repository}@sha256:${'9'.repeat(64)}`,
    modelPath: '/var/lib/kryv-teal-production/releases/a/deploy.docs.yml',
    deployedAt: now.toISOString(),
    previousCandidateSha256: null,
  }
  await assert.rejects(
    observeProductionRelease({
      adapter: {
        observe: async () => ({
          containerId: 'a'.repeat(64),
          configuredImage: state.imageDigest,
          runningImageId: `sha256:${'8'.repeat(64)}`,
          health: 'healthy',
        }),
      },
      clock: () => now,
      release: state,
    }),
    /runtime image identity drift/i,
  )
})

test('fixed controller rejects a Compose model that weakens the reviewed runtime sandbox', () => {
  const image = `${repository}@sha256:${'9'.repeat(64)}`
  const docs = {
    cap_drop: ['ALL'],
    cpus: 1,
    command: null,
    entrypoint: null,
    healthcheck: {
      test: ['CMD', 'wget', '-q', '-O', '/dev/null', 'http://127.0.0.1:8080/healthz'],
      timeout: '3s',
      interval: '10s',
      retries: 6,
      start_period: '5s',
    },
    image,
    logging: { driver: 'json-file', options: { 'max-file': '5', 'max-size': '10m' } },
    mem_limit: '268435456',
    networks: { default: null },
    pids_limit: 128,
    ports: [{ mode: 'ingress', host_ip: '127.0.0.1', target: 8080, published: '8087', protocol: 'tcp' }],
    read_only: true,
    restart: 'unless-stopped',
    security_opt: ['no-new-privileges:true'],
    tmpfs: ['/tmp:rw,noexec,nosuid,nodev,size=16m,mode=1777'],
    user: '101:101',
  }
  const config = {
    name: 'teal-docs-production',
    networks: { default: { name: 'teal-docs-production_default', ipam: {} } },
    services: { docs },
  }
  assert.doesNotThrow(() => validateProductionComposeConfig(JSON.stringify(config), image))
  for (const weakened of [
    { read_only: false },
    { cap_drop: [] },
    { volumes: ['/:/host'] },
    { privileged: true },
    { cap_add: ['SYS_ADMIN'] },
    { network_mode: 'host' },
    { group_add: ['0'] },
    { pids_limit: 0 },
    { mem_limit: '536870912' },
    { ports: [{ host_ip: '0.0.0.0', target: 8080, published: '8087' }] },
    { tmpfs: ['/tmp'] },
    { healthcheck: { disable: true } },
  ]) {
    assert.throws(
      () => validateProductionComposeConfig(JSON.stringify({
        ...config,
        services: { docs: { ...docs, ...weakened } },
      }), image),
      /runtime boundary/i,
    )
  }
  for (const unexpected of [
    { ...config, volumes: {} },
    { ...config, networks: { ...config.networks, hostile: {} } },
    { ...config, networks: { default: { ...config.networks.default, external: true } } },
    { ...config, services: { docs: { ...docs, logging: { ...docs.logging, options: { ...docs.logging.options, labels: 'secret' } } } } },
  ]) {
    assert.throws(
      () => validateProductionComposeConfig(JSON.stringify(unexpected), image),
      /runtime boundary/i,
    )
  }
})
