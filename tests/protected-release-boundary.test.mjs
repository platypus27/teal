import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'
import { parse } from 'yaml'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('protected master creates one complete candidate only after every quality gate', async () => {
  const workflow = parse(await read('.github/workflows/pipeline.yml'))
  const candidate = workflow.jobs.release_candidate

  assert.ok(candidate, 'pipeline must define a release_candidate job')
  assert.deepEqual(candidate.needs, ['quality', 'browser', 'lighthouse', 'production_image'])
  assert.equal(candidate['runs-on'], 'ubuntu-24.04')
  assert.equal(candidate.environment, undefined)
  assert.deepEqual(candidate.permissions, {
    attestations: 'write',
    'artifact-metadata': 'write',
    contents: 'read',
    'id-token': 'write',
  })
  for (const required of [
    "github.event_name == 'push'",
    "github.repository == 'platypus27/teal'",
    "github.ref == 'refs/heads/master'",
    'github.ref_protected == true',
  ]) {
    assert.match(candidate.if, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  }
  assert.equal(candidate.permissions.packages, undefined)
  const source = JSON.stringify(candidate)
  for (const required of [
    'verify:release-package',
    'candidate-manifest.json',
    'docs-image.tar',
    'docs-image.sbom.cdx.json',
    'docs-image.vulnerability.json',
    'docs-image.secret.json',
    'kryv-teal-production-controller.tar',
    'actions/attest@',
    'actions/upload-artifact@',
  ]) {
    assert.ok(source.includes(required), `release candidate must include ${required}`)
  }
  assert.ok(candidate.steps.every((step) => !String(step.run ?? '').includes('npm publish')))
  assert.ok(candidate.steps.every((step) => !String(step.run ?? '').includes('docker push')))
})

test('protected mutation workflow accepts only a prior exact candidate and current owner approval', async () => {
  const workflow = parse(await read('.github/workflows/protected-release.yml'))
  assert.deepEqual(workflow.permissions, {})
  assert.ok(workflow.on.workflow_dispatch)
  const inputs = workflow.on.workflow_dispatch.inputs
  for (const name of [
    'operation',
    'source_run_id',
    'source_run_attempt',
    'source_revision',
    'candidate_sha256',
    'approval_manifest_base64',
    'approval_digest',
    'approval_signature',
  ]) {
    assert.equal(inputs[name]?.required, true, `${name} must be required`)
  }
  assert.deepEqual(inputs.operation.options, ['npm-publish', 'docs-deploy'])
  const source = await read('.github/workflows/protected-release.yml')
  assert.doesNotMatch(source, /actions\/checkout@/)
  assert.doesNotMatch(source, /actions\/setup-(?:go|python|java)@/)
  assert.doesNotMatch(source, /docker\/build-push-action@/)
  assert.doesNotMatch(source, /\bnpm ci\b|\bnpm run build\b/)
})

test('npm mutation stays on a hosted OIDC runner and publishes only the downloaded candidate', async () => {
  const workflow = parse(await read('.github/workflows/protected-release.yml'))
  const publish = workflow.jobs.npm_publish

  assert.ok(publish)
  assert.equal(publish['runs-on'], 'ubuntu-24.04')
  assert.equal(publish.environment, 'teal-release')
  assert.deepEqual(publish.permissions, {
    actions: 'read',
    attestations: 'read',
    contents: 'write',
    'id-token': 'write',
  })
  for (const required of [
    "github.repository == 'platypus27/teal'",
    "github.ref == 'refs/heads/master'",
    'github.ref_protected == true',
    "inputs.operation == 'npm-publish'",
  ]) {
    assert.ok(publish.if.includes(required), required)
  }
  const source = JSON.stringify(publish)
  for (const required of [
    'actions/download-artifact@',
    '${{ inputs.source_run_id }}',
    '${{ inputs.source_run_attempt }}',
    '${{ inputs.source_revision }}',
    '${{ inputs.candidate_sha256 }}',
    '${{ github.run_id }}',
    '${{ github.run_attempt }}',
    'gh attestation verify',
    'verify-owner-approval.mjs',
    'publish:package',
    'reconcile:release',
    'GITHUB_SHA',
    'SOURCE_REVISION',
    '--recovery-only',
    'verification_mode=durable-recovery',
    'kryv-approval/npm-publish/${CANDIDATE_SHA256#sha256:}/${APPROVAL_DIGEST#sha256:}',
  ]) {
    assert.ok(source.includes(required), `npm mutation must include ${required}`)
  }
  const publisher = await read('scripts/publish-candidate-package.mjs')
  assert.match(publisher, /'audit',\s*'signatures'/)
  assert.match(publisher, /--include-attestations/)
  assert.match(publisher, /\.github\/workflows\/protected-release\.yml/)
  assert.match(publisher, /github-hosted/)
})

test('docs mutation delegates the exact candidate to one fixed root controller', async () => {
  const workflow = parse(await read('.github/workflows/protected-release.yml'))
  const deploy = workflow.jobs.docs_deploy

  assert.ok(deploy)
  assert.deepEqual(deploy['runs-on'], ['self-hosted', 'linux', 'teal-production'])
  assert.ok(deploy['timeout-minutes'] >= 90, 'fixed controller and verified rollback need a complete timeout envelope')
  assert.equal(deploy.environment, 'teal-production')
  assert.deepEqual(deploy.permissions, {
    actions: 'read',
    attestations: 'read',
    contents: 'read',
    packages: 'write',
  })
  for (const required of [
    "github.repository == 'platypus27/teal'",
    "github.ref == 'refs/heads/master'",
    'github.ref_protected == true',
    "inputs.operation == 'docs-deploy'",
  ]) {
    assert.ok(deploy.if.includes(required), required)
  }
  const source = JSON.stringify(deploy)
  assert.ok(source.includes('actions/download-artifact@'))
  assert.ok(source.includes('/usr/local/libexec/kryv-teal-production-controller'))
  assert.ok(source.includes('${{ inputs.candidate_sha256 }}'))
  assert.ok(source.includes('${{ inputs.approval_digest }}'))
  assert.doesNotMatch(source, /docker (?:build|push|pull|compose)|ssh |scp |node scripts\//)
})

test('fixed docs controller, owner authority, replay ledger, and observation service are installable', async () => {
  for (const path of [
    'scripts/teal_owner_authority.mjs',
    'scripts/teal_release_candidate.mjs',
    'scripts/build_production_controller.mjs',
    'scripts/install_production_controller.mjs',
    'scripts/kryv_teal_production_controller.mjs',
    'infra/systemd/kryv-teal-production-observation.service',
    'infra/systemd/kryv-teal-production-observation.timer',
    'infra/sudoers.d/kryv-teal-production-controller',
  ]) {
    await access(new URL(`../${path}`, import.meta.url))
  }
  const controller = await read('scripts/kryv_teal_production_controller.mjs')
  for (const required of [
    '/var/lib/kryv-teal-production/consumed-approvals',
    '/var/lib/kryv-teal-production/current-release.json',
    '/var/lib/kryv-teal-production/observation.json',
    '/var/lib/kryv-teal-production/deployment-transaction.json',
    'flock',
    'candidateSha256',
    'sourceRunId',
    'sourceRunAttempt',
    'rollback',
    'recoverProductionTransaction',
  ]) {
    assert.ok(controller.includes(required), `controller must include ${required}`)
  }
})
