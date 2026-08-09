import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import {
  canonicalCandidateManifest,
  createCandidateManifest,
  exactCycloneDxSbom,
  exactScanReceipt,
  sha256Bytes,
  verifyCandidateDirectory,
} from '../scripts/teal_release_candidate.mjs'

const facts = {
  archiveSha256: `sha256:${'a'.repeat(64)}`,
  imageId: `sha256:${'b'.repeat(64)}`,
  repository: 'ghcr.io/platypus27/teal/teal-docs',
  sourceCommit: 'c'.repeat(40),
}
const execute = promisify(execFile)
const candidateCli = fileURLToPath(new URL('../scripts/teal_release_candidate.mjs', import.meta.url))

const requiredFiles = {
  'controller/kryv-teal-production-controller.tar': 'controller',
  'deploy.docs.yml': 'services: {}\n',
  'docs/artifact.json': '{}\n',
  'docs/docs-image.sbom.cdx.json': '{}\n',
  'docs/docs-image.secret.json': '{}\n',
  'docs/docs-image.tar': 'image',
  'docs/docs-image.vulnerability.json': '{}\n',
  'infra/release-owner-approval.json': '{}\n',
  'npm/artifact.json': '{}\n',
  'npm/kryv-teal-0.5.1.tgz': 'package',
  'runtime/owner-approval.mjs': 'export {}\n',
  'runtime/publish-candidate-package.mjs': 'export {}\n',
  'runtime/reconcile-candidate-release.mjs': 'export {}\n',
  'runtime/teal_release_candidate.mjs': 'export {}\n',
  'runtime/teal_owner_authority.mjs': 'export {}\n',
  'runtime/verify-owner-approval.mjs': 'export {}\n',
  'source/repository.bundle': 'bundle',
}

function candidateManifest(files = requiredFiles) {
  return {
    schemaVersion: 1,
    repository: 'platypus27/teal',
    workflow: 'platypus27/teal/.github/workflows/pipeline.yml',
    ref: 'refs/heads/master',
    sourceCommit: 'c'.repeat(40),
    sourceRunId: '1234567890123456789',
    sourceRunAttempt: 2,
    createdAt: '2026-08-07T12:00:00.000Z',
    files: Object.entries(files).map(([path, body]) => ({
      path,
      bytes: Buffer.byteLength(body),
      sha256: `sha256:${createHash('sha256').update(body).digest('hex')}`,
    })),
  }
}

test('binds a passed Trivy receipt to the exact archive, image, source, and raw report', () => {
  const rawBytes = Buffer.from(`${JSON.stringify({
    SchemaVersion: 2,
    ArtifactType: 'container_image',
    ArtifactName: '/scan/image.tar',
    Metadata: { ImageID: facts.imageId },
    Results: [],
  })}\n`)
  const receipt = exactScanReceipt({
    ...facts,
    rawBytes,
    scanType: 'vulnerability',
  })
  const canonicalReport = Buffer.from(`${JSON.stringify({
    SchemaVersion: 2,
    ArtifactType: 'container_image',
    ArtifactName: '/scan/image.tar',
    Metadata: { ImageID: facts.imageId },
    Results: [],
  }, null, 2)}\n`)

  assert.deepEqual(receipt, {
    schemaVersion: 1,
    status: 'passed',
    scanType: 'vulnerability',
    scanner: { name: 'trivy', version: '0.73.0' },
    sourceCommit: facts.sourceCommit,
    repository: facts.repository,
    imageId: facts.imageId,
    archiveSha256: facts.archiveSha256,
    reportSha256: sha256Bytes(canonicalReport),
    report: {
      SchemaVersion: 2,
      ArtifactType: 'container_image',
      ArtifactName: '/scan/image.tar',
      Metadata: { ImageID: facts.imageId },
      Results: [],
    },
  })
})

test('rejects a receipt with the wrong scan type, identity, or Trivy schema', () => {
  const validReport = {
    SchemaVersion: 2,
    ArtifactType: 'container_image',
    Metadata: { ImageID: facts.imageId },
    Results: [],
  }
  const valid = Buffer.from(`${JSON.stringify(validReport)}\n`)
  for (const change of [
    { scanType: 'combined' },
    { archiveSha256: `sha256:${'A'.repeat(64)}` },
    { imageId: `sha256:${'0'.repeat(63)}` },
    { sourceCommit: 'not-a-commit' },
    { repository: 'docker.io/platypus27/teal' },
  ]) {
    assert.throws(
      () => exactScanReceipt({
        ...facts,
        rawBytes: valid,
        scanType: 'secret',
        ...change,
      }),
      /invalid/i,
    )
  }
  assert.throws(
    () => exactScanReceipt({
      ...facts,
      rawBytes: Buffer.from('{"SchemaVersion":1,"Results":[]}\n'),
      scanType: 'secret',
    }),
    /Trivy schema/i,
  )
  for (const report of [
    { ...validReport, ArtifactType: 'filesystem' },
    { ...validReport, Metadata: {} },
    { ...validReport, Metadata: { ImageID: `sha256:${'d'.repeat(64)}` } },
  ]) {
    assert.throws(
      () => exactScanReceipt({
        ...facts,
        rawBytes: Buffer.from(`${JSON.stringify(report)}\n`),
        scanType: 'secret',
      }),
      /image identity/i,
    )
  }
})

test('adds exact Teal identities to a CycloneDX SBOM and replaces spoofed properties', () => {
  const rawBytes = Buffer.from(`${JSON.stringify({
    bomFormat: 'CycloneDX',
    specVersion: '1.6',
    metadata: {
      component: {
        type: 'container',
        properties: [
          { name: 'aquasecurity:trivy:ImageID', value: facts.imageId },
        ],
      },
      properties: [
        { name: 'scanner', value: 'trivy' },
        { name: 'org.kryv.teal.image-id', value: `sha256:${'d'.repeat(64)}` },
      ],
    },
    components: [],
  })}\n`)
  const sbom = exactCycloneDxSbom({ ...facts, rawBytes })
  const properties = new Map(sbom.metadata.properties.map(({ name, value }) => [name, value]))

  assert.equal(properties.get('scanner'), 'trivy')
  assert.equal(properties.get('org.kryv.teal.image-id'), facts.imageId)
  assert.equal(properties.get('org.kryv.teal.archive-sha256'), facts.archiveSha256)
  assert.equal(properties.get('org.kryv.teal.source-commit'), facts.sourceCommit)
  assert.equal(properties.get('org.kryv.teal.repository'), facts.repository)
  assert.equal(
    sbom.metadata.properties.filter(({ name }) => name === 'org.kryv.teal.image-id').length,
    1,
  )
})

test('rejects a CycloneDX document not authored for the exact Trivy image', () => {
  const base = {
    bomFormat: 'CycloneDX',
    specVersion: '1.6',
    metadata: {
      component: {
        type: 'container',
        properties: [{ name: 'aquasecurity:trivy:ImageID', value: facts.imageId }],
      },
    },
    components: [],
  }
  for (const sbom of [
    { ...base, metadata: {} },
    { ...base, metadata: { component: { ...base.metadata.component, type: 'application' } } },
    { ...base, metadata: { component: { ...base.metadata.component, properties: [] } } },
    { ...base, metadata: { component: { ...base.metadata.component, properties: [
      { name: 'aquasecurity:trivy:ImageID', value: facts.imageId },
      { name: 'aquasecurity:trivy:ImageID', value: facts.imageId },
    ] } } },
  ]) {
    assert.throws(
      () => exactCycloneDxSbom({
        ...facts,
        rawBytes: Buffer.from(`${JSON.stringify(sbom)}\n`),
      }),
      /image identity/i,
    )
  }
})

test('canonical candidate manifest binds the protected source run and complete sorted file closure', () => {
  const manifest = candidateManifest()
  const canonical = canonicalCandidateManifest({
    ...manifest,
    files: [...manifest.files].reverse(),
  })
  const parsed = JSON.parse(canonical)

  assert.deepEqual(parsed.files.map(({ path }) => path), Object.keys(requiredFiles).sort())
  assert.equal(parsed.sourceRunId, manifest.sourceRunId)
  assert.equal(parsed.sourceRunAttempt, manifest.sourceRunAttempt)
  assert.equal(parsed.sourceCommit, manifest.sourceCommit)
  assert.throws(
    () => canonicalCandidateManifest({
      ...manifest,
      files: [...manifest.files, { ...manifest.files[0] }],
    }),
    /duplicate/i,
  )
  assert.throws(
    () => canonicalCandidateManifest({
      ...manifest,
      files: manifest.files.map((file, index) => (
        index === 0 ? { ...file, path: 'controller/bad\nname' } : file
      )),
    }),
    /path is invalid/i,
  )
})

test('creates one immutable candidate manifest from the exact staged directory', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'teal-candidate-create-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  for (const [path, body] of Object.entries(requiredFiles)) {
    await mkdir(join(root, path, '..'), { recursive: true })
    await writeFile(join(root, path), body)
  }
  const expected = candidateManifest()
  const result = await createCandidateManifest({
    context: {
      repository: expected.repository,
      workflow: expected.workflow,
      ref: expected.ref,
      sourceCommit: expected.sourceCommit,
      sourceRunId: expected.sourceRunId,
      sourceRunAttempt: expected.sourceRunAttempt,
      createdAt: expected.createdAt,
    },
    root,
  })
  const manifestBytes = await readFile(join(root, 'candidate-manifest.json'))

  assert.deepEqual(result.manifest, JSON.parse(manifestBytes))
  assert.equal(result.manifestSha256, sha256Bytes(manifestBytes))
  await assert.rejects(
    createCandidateManifest({ context: expected, root }),
    /already exists|file closure/i,
  )
})

test('candidate CLI creates and independently verifies the exact protected context', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'teal-candidate-cli-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  for (const [path, body] of Object.entries(requiredFiles)) {
    await mkdir(join(root, path, '..'), { recursive: true })
    await writeFile(join(root, path), body)
  }
  const manifest = candidateManifest()
  const contextArgs = [
    '--root', root,
    '--repository', manifest.repository,
    '--workflow', manifest.workflow,
    '--ref', manifest.ref,
    '--source-commit', manifest.sourceCommit,
    '--source-run-id', manifest.sourceRunId,
    '--source-run-attempt', String(manifest.sourceRunAttempt),
  ]
  const created = await execute(process.execPath, [
    candidateCli,
    'create',
    ...contextArgs,
    '--created-at', manifest.createdAt,
  ])
  assert.match(created.stdout, /^Created candidate manifest sha256:[0-9a-f]{64}\n$/)
  const verified = await execute(process.execPath, [candidateCli, 'verify', ...contextArgs])
  assert.match(verified.stdout, /^Verified candidate manifest sha256:[0-9a-f]{64}\n$/)
  await assert.rejects(
    execute(process.execPath, [
      candidateCli,
      'verify',
      ...contextArgs.map((value) => value === String(manifest.sourceRunAttempt) ? '3' : value),
    ]),
    /sourceRunAttempt mismatch/i,
  )
})

test('verifies every candidate byte and rejects extras, symlinks, tampering, and context drift', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'teal-candidate-contract-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  for (const [path, body] of Object.entries(requiredFiles)) {
    await mkdir(join(root, path, '..'), { recursive: true })
    await writeFile(join(root, path), body)
  }
  const manifest = candidateManifest()
  const manifestBytes = canonicalCandidateManifest(manifest)
  await writeFile(join(root, 'candidate-manifest.json'), manifestBytes)
  const expectedContext = {
    repository: manifest.repository,
    workflow: manifest.workflow,
    ref: manifest.ref,
    sourceCommit: manifest.sourceCommit,
    sourceRunId: manifest.sourceRunId,
    sourceRunAttempt: manifest.sourceRunAttempt,
  }

  await assert.doesNotReject(verifyCandidateDirectory({
    expectedContext,
    manifestBytes,
    root,
  }))

  await writeFile(join(root, 'unexpected'), 'extra')
  await assert.rejects(
    verifyCandidateDirectory({ expectedContext, manifestBytes, root }),
    /file closure/i,
  )
  await rm(join(root, 'unexpected'))

  await writeFile(join(root, 'deploy.docs.yml'), 'changed')
  await assert.rejects(
    verifyCandidateDirectory({ expectedContext, manifestBytes, root }),
    /digest|byte/i,
  )
  await writeFile(join(root, 'deploy.docs.yml'), requiredFiles['deploy.docs.yml'])

  await rm(join(root, 'runtime/verify-owner-approval.mjs'))
  await symlink('../teal_owner_authority.mjs', join(root, 'runtime/verify-owner-approval.mjs'))
  await assert.rejects(
    verifyCandidateDirectory({ expectedContext, manifestBytes, root }),
    /regular file|symbolic/i,
  )
  await rm(join(root, 'runtime/verify-owner-approval.mjs'))
  await writeFile(
    join(root, 'runtime/verify-owner-approval.mjs'),
    requiredFiles['runtime/verify-owner-approval.mjs'],
  )

  await assert.rejects(
    verifyCandidateDirectory({
      expectedContext: { ...expectedContext, sourceRunAttempt: 3 },
      manifestBytes,
      root,
    }),
    /sourceRunAttempt/i,
  )
})
