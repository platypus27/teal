import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import { assembleReleaseCandidate } from '../scripts/assemble-release-candidate.mjs'
import {
  exactCycloneDxSbom,
  exactScanReceipt,
  sha256Bytes,
  verifyCandidateDirectory,
} from '../scripts/teal_release_candidate.mjs'

const sourceCommit = '1'.repeat(40)
const repository = 'ghcr.io/platypus27/teal/teal-docs'
const execute = promisify(execFile)
const assembler = fileURLToPath(new URL('../scripts/assemble-release-candidate.mjs', import.meta.url))

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'teal-candidate-assembly-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const npmRoot = join(root, 'npm')
  const docsRoot = join(root, 'docs')
  await mkdir(npmRoot)
  await mkdir(docsRoot)
  const tarball = join(npmRoot, 'kryv-teal-0.5.1.tgz')
  const tarballBytes = Buffer.from('exact npm package')
  await writeFile(tarball, tarballBytes)
  await writeFile(join(npmRoot, 'artifact.json'), `${JSON.stringify({
    name: '@kryv/teal',
    version: '0.5.1',
    sourceCommit,
    integrity: `sha512-${createHash('sha512').update(tarballBytes).digest('base64')}`,
    tarballPath: tarball,
  }, null, 2)}\n`)

  const imageBytes = Buffer.from('exact docs image')
  const imageId = `sha256:${'2'.repeat(64)}`
  const archiveSha256 = sha256Bytes(imageBytes)
  await writeFile(join(docsRoot, 'docs-image.tar'), imageBytes)
  const rawReport = Buffer.from(`${JSON.stringify({
    SchemaVersion: 2,
    ArtifactType: 'container_image',
    Metadata: { ImageID: imageId },
    Results: [],
  })}\n`)
  const vulnerability = Buffer.from(`${JSON.stringify(exactScanReceipt({
    archiveSha256,
    imageId,
    rawBytes: rawReport,
    repository,
    scanType: 'vulnerability',
    sourceCommit,
  }), null, 2)}\n`)
  const secret = Buffer.from(`${JSON.stringify(exactScanReceipt({
    archiveSha256,
    imageId,
    rawBytes: rawReport,
    repository,
    scanType: 'secret',
    sourceCommit,
  }), null, 2)}\n`)
  const sbom = Buffer.from(`${JSON.stringify(exactCycloneDxSbom({
    archiveSha256,
    imageId,
    rawBytes: Buffer.from(`${JSON.stringify({
      bomFormat: 'CycloneDX',
      specVersion: '1.6',
      metadata: {
        component: {
          type: 'container',
          properties: [{ name: 'aquasecurity:trivy:ImageID', value: imageId }],
        },
      },
      components: [],
    })}\n`),
    repository,
    sourceCommit,
  }), null, 2)}\n`)
  await writeFile(join(docsRoot, 'docs-image.vulnerability.json'), vulnerability)
  await writeFile(join(docsRoot, 'docs-image.secret.json'), secret)
  await writeFile(join(docsRoot, 'docs-image.sbom.cdx.json'), sbom)
  await writeFile(join(docsRoot, 'artifact.json'), `${JSON.stringify({
    schemaVersion: 2,
    sourceCommit,
    repository,
    imageId,
    archive: 'docs-image.tar',
    archiveSha256,
    sbom: 'docs-image.sbom.cdx.json',
    sbomSha256: sha256Bytes(sbom),
    vulnerabilityReceipt: 'docs-image.vulnerability.json',
    vulnerabilityReceiptSha256: sha256Bytes(vulnerability),
    secretReceipt: 'docs-image.secret.json',
    secretReceiptSha256: sha256Bytes(secret),
  }, null, 2)}\n`)

  const controllerArchive = join(root, 'controller.tar')
  const sourceBundle = join(root, 'repository.bundle')
  const deploymentModel = join(root, 'deploy.docs.yml')
  await writeFile(controllerArchive, 'controller archive')
  await writeFile(sourceBundle, 'source bundle')
  await writeFile(deploymentModel, 'services:\n  docs:\n    image: ${TEAL_DOCS_IMAGE:?required}\n')
  return {
    candidateRoot: join(root, 'candidate'),
    controllerArchive,
    deploymentModel,
    docsRoot,
    npmRoot,
    sourceBundle,
  }
}

test('assembles and independently verifies the complete immutable candidate', async (t) => {
  const inputs = await fixture(t)
  const result = await assembleReleaseCandidate({
    ...inputs,
    createdAt: '2026-08-07T12:00:00.000Z',
    sourceCommit,
    sourceRunAttempt: 2,
    sourceRunId: '1234567890123456789',
    workspaceRoot: resolve(import.meta.dirname, '..'),
  })
  const manifestBytes = await readFile(join(inputs.candidateRoot, 'candidate-manifest.json'))
  const verified = await verifyCandidateDirectory({
    expectedContext: {
      repository: 'platypus27/teal',
      workflow: 'platypus27/teal/.github/workflows/pipeline.yml',
      ref: 'refs/heads/master',
      sourceCommit,
      sourceRunId: '1234567890123456789',
      sourceRunAttempt: 2,
    },
    manifestBytes,
    root: inputs.candidateRoot,
  })

  assert.equal(result.manifestSha256, verified.manifestSha256)
  const npmDescriptor = JSON.parse(await readFile(join(inputs.candidateRoot, 'npm/artifact.json')))
  assert.equal(npmDescriptor.tarball, 'kryv-teal-0.5.1.tgz')
  assert.match(npmDescriptor.tarballSha256, /^sha256:[0-9a-f]{64}$/)
})

test('rejects a docs receipt that is not bound to the exact image', async (t) => {
  const inputs = await fixture(t)
  const receiptPath = join(inputs.docsRoot, 'docs-image.secret.json')
  const receipt = JSON.parse(await readFile(receiptPath, 'utf8'))
  await writeFile(receiptPath, `${JSON.stringify({
    ...receipt,
    imageId: `sha256:${'3'.repeat(64)}`,
  }, null, 2)}\n`)

  await assert.rejects(
    assembleReleaseCandidate({
      ...inputs,
      createdAt: '2026-08-07T12:00:00.000Z',
      sourceCommit,
      sourceRunAttempt: 2,
      sourceRunId: '1234567890123456789',
      workspaceRoot: resolve(import.meta.dirname, '..'),
    }),
    /secret.*(?:image|digest)|image.*mismatch/i,
  )
})

test('candidate assembler CLI emits the exact manifest digest', async (t) => {
  const inputs = await fixture(t)
  const completed = await execute(process.execPath, [
    assembler,
    '--candidate-root', inputs.candidateRoot,
    '--controller-archive', inputs.controllerArchive,
    '--created-at', '2026-08-07T12:00:00.000Z',
    '--deployment-model', inputs.deploymentModel,
    '--docs-root', inputs.docsRoot,
    '--npm-root', inputs.npmRoot,
    '--source-bundle', inputs.sourceBundle,
    '--source-commit', sourceCommit,
    '--source-run-attempt', '2',
    '--source-run-id', '1234567890123456789',
    '--workspace-root', resolve(import.meta.dirname, '..'),
  ])
  assert.match(completed.stdout, /^Assembled release candidate sha256:[0-9a-f]{64}\n$/)
})
