import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'

import {
  assertVerifiedRegistryProvenance,
  publishOrVerifyCandidatePackage,
  validateCandidatePackage,
} from '../scripts/publish-candidate-package.mjs'

const execute = promisify(execFile)
const sourceCommit = '1'.repeat(40)
const publicationRunId = '9876543210'
const publicationRunAttempt = 2

function provenanceReport(artifact, {
  runAttempt = publicationRunAttempt,
  runId = publicationRunId,
} = {}) {
  const statement = {
    _type: 'https://in-toto.io/Statement/v1',
    subject: [{
      name: `pkg:npm/%40kryv/teal@${artifact.version}`,
      digest: {
        sha512: Buffer.from(artifact.integrity.slice('sha512-'.length), 'base64').toString('hex'),
      },
    }],
    predicateType: 'https://slsa.dev/provenance/v1',
    predicate: {
      buildDefinition: {
        buildType: 'https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1',
        externalParameters: {
          workflow: {
            ref: 'refs/heads/master',
            repository: 'https://github.com/platypus27/teal',
            path: '.github/workflows/protected-release.yml',
          },
        },
        internalParameters: { github: { event_name: 'workflow_dispatch' } },
        resolvedDependencies: [{
          uri: 'git+https://github.com/platypus27/teal@refs/heads/master',
          digest: { gitCommit: artifact.sourceCommit },
        }],
      },
      runDetails: {
        builder: { id: 'https://github.com/actions/runner/github-hosted' },
        metadata: {
          invocationId: `https://github.com/platypus27/teal/actions/runs/${runId}/attempts/${runAttempt}`,
        },
      },
    },
  }
  return {
    invalid: [],
    missing: [],
    verified: [{
      name: artifact.name,
      version: artifact.version,
      registry: 'https://registry.npmjs.org/',
      attestations: {
        url: `https://registry.npmjs.org/-/npm/v1/attestations/@kryv%2fteal@${artifact.version}`,
        provenance: { predicateType: 'https://slsa.dev/provenance/v1' },
      },
      attestationBundles: [{
        predicateType: 'https://slsa.dev/provenance/v1',
        bundle: {
          dsseEnvelope: {
            payload: Buffer.from(JSON.stringify(statement)).toString('base64'),
          },
        },
      }],
    }],
  }
}

async function fixture(t, { withSymlink = false } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'teal-candidate-package-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const packageRoot = join(root, 'source', 'package')
  const candidateRoot = join(root, 'candidate', 'npm')
  await mkdir(join(packageRoot, 'dist'), { recursive: true })
  await mkdir(candidateRoot, { recursive: true })
  await writeFile(join(packageRoot, 'package.json'), `${JSON.stringify({
    name: '@kryv/teal',
    version: '0.5.1',
    gitHead: sourceCommit,
    files: ['dist'],
    exports: { '.': './dist/index.js' },
  })}\n`)
  await writeFile(join(packageRoot, 'dist/index.js'), 'export const teal = true\n')
  if (withSymlink) await symlink('/etc/passwd', join(packageRoot, 'dist/escape'))
  const tarball = join(candidateRoot, 'kryv-teal-0.5.1.tgz')
  await execute('/usr/bin/tar', [
    '--create',
    '--gzip',
    '--format=ustar',
    '--file', tarball,
    '--directory', join(root, 'source'),
    'package',
  ])
  const bytes = await import('node:fs/promises').then(({ readFile }) => readFile(tarball))
  const descriptor = {
    schemaVersion: 1,
    name: '@kryv/teal',
    version: '0.5.1',
    sourceCommit,
    integrity: `sha512-${createHash('sha512').update(bytes).digest('base64')}`,
    tarball: 'kryv-teal-0.5.1.tgz',
    tarballSha256: `sha256:${createHash('sha256').update(bytes).digest('hex')}`,
  }
  await writeFile(join(candidateRoot, 'artifact.json'), `${JSON.stringify(descriptor, null, 2)}\n`)
  return { candidateRoot: join(root, 'candidate'), descriptor, tarball }
}

test('validates the exact candidate tarball without a checkout or rebuild', async (t) => {
  const candidate = await fixture(t)
  const artifact = await validateCandidatePackage({
    candidateRoot: candidate.candidateRoot,
    expectedSourceCommit: sourceCommit,
  })

  assert.equal(artifact.name, '@kryv/teal')
  assert.equal(artifact.version, '0.5.1')
  assert.equal(artifact.sourceCommit, sourceCommit)
  assert.equal(artifact.tarballPath, candidate.tarball)
  assert.equal(artifact.packageJson.gitHead, sourceCommit)
})

test('rejects changed bytes, source drift, links, and unknown descriptor fields', async (t) => {
  const candidate = await fixture(t)
  await writeFile(candidate.tarball, 'changed')
  await assert.rejects(
    validateCandidatePackage({
      candidateRoot: candidate.candidateRoot,
      expectedSourceCommit: sourceCommit,
    }),
    /integrity|digest|gzip|archive/i,
  )

  const sourceDrift = await fixture(t)
  await assert.rejects(
    validateCandidatePackage({
      candidateRoot: sourceDrift.candidateRoot,
      expectedSourceCommit: '2'.repeat(40),
    }),
    /source commit/i,
  )

  const linked = await fixture(t, { withSymlink: true })
  await assert.rejects(
    validateCandidatePackage({
      candidateRoot: linked.candidateRoot,
      expectedSourceCommit: sourceCommit,
    }),
    /link|archive entry type/i,
  )

  const unknown = await fixture(t)
  const descriptorPath = join(unknown.candidateRoot, 'npm', 'artifact.json')
  const descriptor = JSON.parse(await readFile(descriptorPath, 'utf8'))
  await writeFile(descriptorPath, `${JSON.stringify({ ...descriptor, tag: 'latest' })}\n`)
  await assert.rejects(
    validateCandidatePackage({
      candidateRoot: unknown.candidateRoot,
      expectedSourceCommit: sourceCommit,
    }),
    /descriptor fields/i,
  )
})

test('requires npm-verified provenance for the exact protected workflow run and source', async (t) => {
  const candidate = await fixture(t)
  const artifact = await validateCandidatePackage({
    candidateRoot: candidate.candidateRoot,
    expectedSourceCommit: sourceCommit,
  })
  const report = provenanceReport(artifact)
  assert.doesNotThrow(() => assertVerifiedRegistryProvenance({
    artifact,
    auditReport: report,
    publicationRunAttempt,
    publicationRunId,
  }))

  const mutations = [
    (statement) => { statement.subject[0].digest.sha512 = '0'.repeat(128) },
    (statement) => { statement.predicate.buildDefinition.externalParameters.workflow.path = '.github/workflows/pipeline.yml' },
    (statement) => { statement.predicate.buildDefinition.resolvedDependencies[0].digest.gitCommit = '2'.repeat(40) },
    (statement) => { statement.predicate.runDetails.builder.id = 'https://github.com/actions/runner/self-hosted' },
    (statement) => { statement.predicate.runDetails.metadata.invocationId = 'https://github.com/platypus27/teal/actions/runs/1/attempts/1' },
  ]
  for (const mutate of mutations) {
    const changed = structuredClone(report)
    const envelope = changed.verified[0].attestationBundles[0].bundle.dsseEnvelope
    const statement = JSON.parse(Buffer.from(envelope.payload, 'base64'))
    mutate(statement)
    envelope.payload = Buffer.from(JSON.stringify(statement)).toString('base64')
    assert.throws(
      () => assertVerifiedRegistryProvenance({
        artifact,
        auditReport: changed,
        publicationRunAttempt,
        publicationRunId,
      }),
      /verified provenance/i,
    )
  }

  const priorInvocation = provenanceReport(artifact, { runId: '123456789', runAttempt: 7 })
  assert.doesNotThrow(() => assertVerifiedRegistryProvenance({
    artifact,
    auditReport: priorInvocation,
    publicationRunAttempt,
    publicationRunId,
    requireCurrentInvocation: false,
  }))
  assert.throws(
    () => assertVerifiedRegistryProvenance({
      artifact,
      auditReport: priorInvocation,
      publicationRunAttempt,
      publicationRunId,
      requireCurrentInvocation: true,
    }),
    /verified provenance/i,
  )
})

test('publishes an absent version once and then requires exact registry provenance', async (t) => {
  const candidate = await fixture(t)
  const artifact = await validateCandidatePackage({
    candidateRoot: candidate.candidateRoot,
    expectedSourceCommit: sourceCommit,
  })
  let registry
  const calls = []
  const provenanceCalls = []
  const result = await publishOrVerifyCandidatePackage(artifact, {
    inspect: async () => registry,
    publish: async (value) => {
      calls.push(value.tarballPath)
      registry = {
        name: value.name,
        version: value.version,
        gitHead: value.sourceCommit,
        dist: {
          integrity: value.integrity,
          attestations: {
            url: `https://registry.npmjs.org/-/npm/v1/attestations/@kryv%2fteal@${value.version}`,
            provenance: { predicateType: 'https://slsa.dev/provenance/v1' },
          },
        },
      }
    },
    verifyProvenance: async (value, publishedRegistry, context) => {
      provenanceCalls.push([value.sourceCommit, publishedRegistry.dist.integrity])
      assert.deepEqual(context, { requireCurrentInvocation: true })
    },
  })

  assert.equal(result.published, true)
  assert.deepEqual(calls, [candidate.tarball])
  assert.deepEqual(provenanceCalls, [[artifact.sourceCommit, artifact.integrity]])
  await assert.rejects(
    publishOrVerifyCandidatePackage(artifact, {
      inspect: async () => registry,
      publish: async () => assert.fail('existing exact bytes must require durable recovery'),
      verifyProvenance: async () => assert.fail('fresh mode must fail before provenance'),
    }),
    /durable recovery/i,
  )
  await assert.doesNotReject(publishOrVerifyCandidatePackage(artifact, {
    inspect: async () => registry,
    publish: async () => assert.fail('exact version must not publish twice'),
    verifyProvenance: async (value, publishedRegistry, context) => {
      provenanceCalls.push([value.sourceCommit, publishedRegistry.dist.integrity])
      assert.deepEqual(context, { requireCurrentInvocation: false })
    },
  }, { recoveryOnly: true }))
  assert.equal(provenanceCalls.length, 2)
  await assert.rejects(
    publishOrVerifyCandidatePackage(artifact, {
      inspect: async () => undefined,
      publish: async () => assert.fail('recovery must never perform a delayed publish'),
      verifyProvenance: async () => assert.fail('absent recovery must fail before provenance'),
    }, { recoveryOnly: true }),
    /recovery.*absent|absent.*recovery/i,
  )
  await assert.rejects(
    publishOrVerifyCandidatePackage(artifact, {
      inspect: async () => ({
        ...registry,
        dist: { ...registry.dist, integrity: `sha512-${Buffer.alloc(64).toString('base64')}` },
      }),
      publish: async () => assert.fail('conflict must fail closed'),
      verifyProvenance: async () => assert.fail('conflicting bytes must fail before provenance verification'),
    }, { recoveryOnly: true }),
    /integrity mismatch/i,
  )
  for (const attestations of [
    {
      url: `https://example.com/-/npm/v1/attestations/@kryv%2fteal@${artifact.version}`,
      provenance: { predicateType: 'https://slsa.dev/provenance/v1' },
    },
    {
      url: `https://registry.npmjs.org/-/npm/v1/attestations/@kryv%2fteal@${artifact.version}`,
      provenance: { predicateType: 'https://example.com/untrusted' },
    },
  ]) {
    await assert.rejects(
      publishOrVerifyCandidatePackage(artifact, {
        inspect: async () => ({ ...registry, dist: { ...registry.dist, attestations } }),
        publish: async () => assert.fail('untrusted provenance must not publish over an existing version'),
        verifyProvenance: async () => assert.fail('untrusted metadata must fail before provenance verification'),
      }, { recoveryOnly: true }),
      /provenance is invalid/i,
    )
  }
})
