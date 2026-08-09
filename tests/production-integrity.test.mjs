import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import test from 'node:test'
import { parse } from 'yaml'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')
const require = createRequire(import.meta.url)

test('package lifecycle builds and validates a non-recursive dry-run pack', async () => {
  const packageJson = JSON.parse(await read('packages/teal/package.json'))
  assert.equal(packageJson.scripts.prepack, 'node scripts/prepack-package.mjs')
  const verifier = await read('packages/teal/scripts/prepack-package.mjs')
  assert.match(verifier, /npm['"], \['pack', '--dry-run', '--ignore-scripts', '--json'\]/)
  assert.match(verifier, /assertPackedFiles/)
})

test('locks the Node, npm, browser, Lighthouse, and audit toolchain', async () => {
  const rootPackage = JSON.parse(await read('package.json'))
  const docsPackage = JSON.parse(await read('apps/docs/package.json'))
  const lock = JSON.parse(await read('package-lock.json'))
  assert.equal((await read('.nvmrc')).trim(), '24.19.0')
  assert.equal((await read('.node-version')).trim(), '24.19.0')
  assert.equal(rootPackage.packageManager, 'npm@11.19.0')
  assert.deepEqual(rootPackage.engines, { node: '>=24.19.0 <25', npm: '>=11.19.0 <12' })
  assert.equal(rootPackage.scripts['audit:dependencies'], 'npm audit --audit-level=high')
  assert.equal(docsPackage.scripts['install:browser'], 'playwright install')
  assert.equal(docsPackage.scripts.lighthouse, 'lhci autorun --config=../../lighthouserc.cjs')
  assert.equal(lock.packages['node_modules/nanoid'].version, '3.3.18')
  assert.doesNotMatch(await read('.github/workflows/pipeline.yml'), /\bnpx\s/)
  assert.doesNotMatch(await read('packages/teal/scripts/verify-package.mjs'), /npm['"], \['exec'/)
})

test('fresh-clone verification builds Teal before downstream typechecking', async () => {
  const rootPackage = JSON.parse(await read('package.json'))
  const commands = rootPackage.scripts.verify.split(' && ')
  assert.ok(commands.indexOf('npm run build --workspace @kryv/teal') < commands.indexOf('npm run typecheck'))
  const workflow = parse(await read('.github/workflows/pipeline.yml'))
  const runs = workflow.jobs.quality.steps.map((step) => step.run).filter(Boolean)
  assert.ok(runs.indexOf('npm run build --workspace @kryv/teal') < runs.indexOf('npm run typecheck'))
  assert.ok(runs.includes('npm run test:integrity'))
})

test('browser gates surface flakes instead of retrying them away', async () => {
  const config = await read('apps/docs/playwright.config.js')
  assert.match(config, /retries:\s*0/)
  assert.doesNotMatch(config, /process\.env\.CI\s*\?\s*[1-9]/)
})

test('Lighthouse makes layout stability a release-blocking web vital', () => {
  const config = require('../lighthouserc.cjs')
  const readyPattern = new RegExp(config.ci.collect.startServerReadyPattern, 'i')
  assert.equal(config.ci.collect.numberOfRuns, 3)
  assert.equal(config.ci.assert.aggregationMethod, 'median')
  assert.match('http://127.0.0.1:4173/', readyPattern)
  assert.match(
    '\u001b[36mhttp://127.0.0.1:\u001b[1m4173\u001b[22m/',
    readyPattern,
  )
  assert.doesNotMatch('http://127.0.0.1:14173/', readyPattern)
  assert.deepEqual(config.ci.assert.assertions['categories:performance'], [
    'error',
    { minScore: 0.9 },
  ])
  assert.deepEqual(config.ci.assert.assertions['cumulative-layout-shift'], [
    'error',
    { maxNumericValue: 0.1 },
  ])
})

test('all workflow actions are approved immutable SHAs and every job is bounded', async () => {
  const workflows = [
    parse(await read('.github/workflows/pipeline.yml')),
    parse(await read('.github/workflows/protected-release.yml')),
  ]
  const approvedActions = new Set([
    'actions/attest@1e69f48acb82d1966a394da916b4c1698aa569d6',
    'actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1',
    'actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093',
    'actions/setup-node@820762786026740c76f36085b0efc47a31fe5020',
    'actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02',
    'changesets/action@3841a0683d3cfa6dae0f9bb335290003010fe3f0',
    'docker/build-push-action@53b7df96c91f9c12dcc8a07bcb9ccacbed38856a',
  ])
  for (const workflow of workflows) {
    for (const [name, job] of Object.entries(workflow.jobs)) {
      if (name === 'docs_deploy') {
        assert.deepEqual(job['runs-on'], ['self-hosted', 'linux', 'teal-production'])
      } else {
        assert.equal(job['runs-on'], 'ubuntu-24.04', `${name} runner must be pinned`)
      }
      assert.ok(Number.isInteger(job['timeout-minutes']), `${name} needs timeout-minutes`)
      for (const step of job.steps ?? []) {
        if (!step.uses) continue
        assert.match(step.uses, /^[^@]+@[0-9a-f]{40}$/)
        assert.ok(approvedActions.has(step.uses), `${name} uses unapproved action ${step.uses}`)
        if (step.uses.startsWith('actions/checkout@')) {
          assert.equal(step.with?.['persist-credentials'], false, `${name} checkout must not persist credentials`)
        }
      }
    }
  }
})

test('planning, versioning, candidate creation, and protected mutation are separate least-privilege jobs', async () => {
  const pipeline = parse(await read('.github/workflows/pipeline.yml'))
  const protectedRelease = parse(await read('.github/workflows/protected-release.yml'))
  const { release_candidate: candidate, release_plan: plan, release_version: version } = pipeline.jobs
  const publish = protectedRelease.jobs.npm_publish
  assert.equal(pipeline.on.workflow_dispatch, null)
  assert.deepEqual(protectedRelease.permissions, {})
  assert.deepEqual(plan.permissions, { contents: 'read' })
  assert.ok(plan.needs.includes('production_image'))
  assert.equal(plan.outputs.mode, '${{ steps.plan.outputs.mode }}')
  assert.ok(plan.steps.some((step) => step.run === 'npm run create:release-package'))
  assert.ok(plan.steps.some((step) => /npm run (?:--silent )?plan:release/.test(step.run ?? '')))
  assert.deepEqual(version.permissions, { contents: 'write', 'pull-requests': 'write' })
  assert.match(version.if, /github\.repository == 'platypus27\/teal'/)
  assert.match(version.if, /github\.ref == 'refs\/heads\/master'/)
  assert.match(version.if, /github\.ref_protected == true/)
  assert.equal(version.permissions['id-token'], undefined)
  assert.equal(version.concurrency['cancel-in-progress'], false)
  const versionAction = version.steps.find((step) => String(step.uses).startsWith('changesets/action@'))
  assert.equal(versionAction.with.commitMode, 'github-api')
  assert.equal(versionAction.with.createGithubReleases, false)
  assert.equal(versionAction.with.publish, undefined)

  assert.deepEqual(candidate.needs, ['quality', 'browser', 'lighthouse', 'production_image'])
  assert.deepEqual(candidate.permissions, {
    attestations: 'write',
    'artifact-metadata': 'write',
    contents: 'read',
    'id-token': 'write',
  })
  assert.match(candidate.if, /github\.repository == 'platypus27\/teal'/)
  assert.match(candidate.if, /github\.ref_protected == true/)
  assert.equal(candidate.environment, undefined)
  assert.ok(candidate.steps.some((step) => step.run === 'npm run verify:release-package'))
  assert.ok(candidate.steps.some((step) => (
    step.run === 'npm run install:browser --workspace @kryv/teal-docs -- chromium'
  )))
  assert.ok(candidate.steps.every((step) => step.run !== 'npm run create:release-package'))

  assert.deepEqual(publish.permissions, {
    actions: 'read',
    attestations: 'read',
    contents: 'write',
    'id-token': 'write',
  })
  assert.equal(publish.permissions['pull-requests'], undefined)
  assert.equal(publish.environment, 'teal-release')
  assert.match(publish.if, /npm-publish/)
  assert.match(publish.if, /github\.repository == 'platypus27\/teal'/)
  assert.match(publish.if, /github\.ref_protected == true/)
  const verifyIndex = publish.steps.findIndex((step) => step.name === 'Verify protected candidate provenance and closure')
  const approvalIndex = publish.steps.findIndex((step) => step.name === 'Verify and durably consume exact owner approval')
  const publishIndex = publish.steps.findIndex((step) => /publish-candidate-package\.mjs/.test(step.run ?? ''))
  const reconcileIndex = publish.steps.findIndex((step) => /reconcile-candidate-release\.mjs/.test(step.run ?? ''))
  assert.ok(verifyIndex >= 0 && verifyIndex < approvalIndex && approvalIndex < publishIndex && publishIndex < reconcileIndex)
  assert.match(publish.steps[verifyIndex].run, /gh attestation verify/)
  assert.match(publish.steps[verifyIndex].run, /teal_release_candidate\.mjs/)
  assert.match(publish.steps[approvalIndex].run, /verify-owner-approval\.mjs/)
  assert.match(publish.steps[approvalIndex].run, /--operation npm-publish/)
  assert.match(publish.steps[approvalIndex].run, /--repository "\$GITHUB_REPOSITORY"/)
  assert.match(publish.steps[approvalIndex].run, /--environment teal-release/)
  assert.match(publish.steps[approvalIndex].run, /--workflow platypus27\/teal\/\.github\/workflows\/protected-release\.yml/)
  assert.match(publish.steps[approvalIndex].run, /refs\/tags\/kryv-approval\/npm-publish\/\$\{CANDIDATE_SHA256#sha256:\}\/\$\{APPROVAL_DIGEST#sha256:\}/)
  assert.match(publish.steps[approvalIndex].run, /test "\$GITHUB_SHA" = "\$SOURCE_REVISION"/)
  assert.match(publish.steps[publishIndex].run, /--recovery-only/)
  assert.ok(publish.steps.every((step) => !String(step.uses).startsWith('changesets/action@')))
  assert.ok(publish.steps.every((step) => !String(step.uses).startsWith('actions/checkout@')))
})

test('docs and Authentik images use exact identities and an unprivileged runtime', async () => {
  const dockerfile = await read('apps/docs/Dockerfile')
  assert.match(dockerfile, /^FROM node:24\.19\.0-alpine3\.24@sha256:d32cdf619f63fe0471182d08996dd516c6275bb5fd31ae06e55a570bd9e1ad43 AS build$/m)
  assert.match(dockerfile, /^FROM nginxinc\/nginx-unprivileged:1\.30\.4-alpine3\.24@sha256:44e36330f74d4f3a1d4e222acca9e23b401fb87811a7597024502bb759c4dd49 AS serve$/m)
  assert.match(dockerfile, /^USER 101:101$/m)
  assert.match(dockerfile, /^EXPOSE 8080$/m)
  assert.match(dockerfile, /^HEALTHCHECK .*http:\/\/127\.0\.0\.1:8080\/healthz/m)

  const nginx = await read('apps/docs/nginx.conf')
  assert.match(nginx, /listen 8080;/)
  assert.match(nginx, /location = \/healthz \{/)
  for (const header of ['Content-Security-Policy', 'Referrer-Policy', 'Permissions-Policy']) {
    assert.match(nginx, new RegExp(`add_header ${header} `))
  }

  const docs = parse(await read('docker-compose.yml')).services.docs
  assert.match(docs.image, /\$\{TEAL_DOCS_IMAGE:-/)
  assert.equal(docs.user, '101:101')
  assert.equal(docs.read_only, true)
  assert.deepEqual(docs.cap_drop, ['ALL'])
  assert.ok(docs.security_opt.includes('no-new-privileges:true'))
  assert.ok(docs.ports.includes('127.0.0.1:8087:8080'))
  assert.ok(docs.tmpfs.some((entry) => entry.startsWith('/tmp:')))
  assert.ok(docs.healthcheck)

  const fixture = parse(await read('packages/teal/test/authentik/docker-compose.yml'))
  assert.equal(fixture.services.postgresql.image, 'postgres:16.14-alpine3.24@sha256:57c72fd2a128e416c7fcc499958864df5301e940bca0a56f58fddf30ffc07777')
  assert.equal(fixture.services.redis.image, 'redis:7.4.10-alpine3.21@sha256:e7723ff73d963f5cc6d9c4643ea3d989527a402a319239054e9472a7fb9219a2')
  const authentik = 'ghcr.io/goauthentik/server:2026.5.6@sha256:ed120caf710ccf82ef0026f0bc74e51615bc95ebff228a7a2d6fc60c441c3868'
  assert.equal(fixture.services.server.image, authentik)
  assert.equal(fixture.services.worker.image, authentik)
})

test('production image verification scans and smokes one isolated exact candidate', async () => {
  const workflow = parse(await read('.github/workflows/pipeline.yml'))
  const imageJob = workflow.jobs.production_image
  const build = imageJob.steps.find((step) => String(step.uses).startsWith('docker/build-push-action@'))
  const imageVerification = imageJob.steps.find((step) => step.name === 'Verify exact production image')
  const retainedVerification = workflow.jobs.release_candidate.steps.find(
    (step) => step.name === 'Retain exact image, SBOM, and scan receipts',
  )
  const imageInstallIndex = imageJob.steps.findIndex((step) => step.run === 'npm ci --ignore-scripts')
  const imageVerificationIndex = imageJob.steps.indexOf(imageVerification)
  assert.equal(build.with.load, true)
  assert.equal(build.with.push, false)
  assert.match(build.with.labels, /org\.opencontainers\.image\.revision=\$\{\{ github\.sha \}\}/)
  assert.match(build.with.labels, /org\.opencontainers\.image\.source=\$\{\{ github\.server_url \}\}\/\$\{\{ github\.repository \}\}/)
  assert.ok(imageJob.steps.some((step) => /npm run verify:docs-image -- --image .* --revision "\$\{GITHUB_SHA\}" --source "\$\{GITHUB_SERVER_URL\}\/\$\{GITHUB_REPOSITORY\}"/.test(step.run ?? '')))
  assert.match(imageVerification.run, /--temporary-root "\$\{RUNNER_TEMP\}"/)
  assert.match(retainedVerification.run, /--temporary-root "\$\{RUNNER_TEMP\}"/)
  assert.ok(imageInstallIndex >= 0 && imageInstallIndex < imageVerificationIndex)
  assert.ok(workflow.jobs.release_plan.needs.includes('production_image'))
  assert.ok(workflow.jobs.release_candidate.needs.includes('production_image'))

  const verifier = await read('scripts/verify-docs-image.mjs')
  const candidateEvidence = await read('scripts/teal_release_candidate.mjs')
  const verifierClosure = `${verifier}\n${candidateEvidence}`
  for (const required of [
    'docker', 'save', '--output', '--read-only', '--cap-drop', 'ALL',
    'no-new-privileges:true', '--no-build', 'config', '--format', 'json',
    '127.0.0.1', "'port'", '.Image',
    'org.opencontainers.image.revision', 'org.opencontainers.image.source',
    'verifyDockerArchiveImageId',
    'archiveSha256', 'sourceCommit', '--descriptor', '--repository',
    'docs-image.tar', 'docs-image.sbom.cdx.json',
    'docs-image.vulnerability.json', 'docs-image.secret.json',
    'org.kryv.teal.image-id', 'org.kryv.teal.archive-sha256',
    'scanType', 'reportSha256',
  ]) {
    assert.ok(verifierClosure.includes(required), `image verifier must contain ${required}`)
  }
  assert.match(verifier, /teal-integrity-/)
  assert.match(verifier, /\['save', '--output', archivePath, localImageId\]/)
  assert.match(verifier, /docs\.image = localImageId/)
  assert.doesNotMatch(verifier, /--ignore-unfixed/)
  assert.match(verifier, /delete generatedConfig\.name/)
  assert.match(verifier, /delete network\.name/)
  assert.match(verifier, /aquasec\/trivy:0\.73\.0@sha256:7cced7cae583819fc7806d4cbc0dbbc7cad18b99f7d3e235192e6da8c091045c/)
  assert.match(verifier, /--user/)
  assert.match(verifier, /trivy-evidence/)
  assert.doesNotMatch(verifier, /trivyRunArgs\([\s\S]{0,200}temporaryDirectory/)
  assert.doesNotMatch(verifier, /\/var\/run\/docker\.sock|teal-docs-1/)
})

test('fixed production controller repeats archive scan and hardened smoke before registry push', async () => {
  const controller = await read('scripts/kryv_teal_production_controller.mjs')
  assert.match(controller, /aquasec\/trivy:0\.73\.0@sha256:7cced7cae583819fc7806d4cbc0dbbc7cad18b99f7d3e235192e6da8c091045c/)
  assert.match(controller, /async verifyCandidate\(\{ archivePath, imageId \}\)/)
  assert.match(controller, /--scanners[\s\S]{0,120}vuln/)
  assert.match(controller, /--scanners[\s\S]{0,120}secret/)
  assert.match(controller, /--read-only/)
  assert.match(controller, /no-new-privileges:true/)
  assert.match(controller, /--cap-drop[\s\S]{0,30}ALL/)
  assert.match(controller, /await adapter\.verifyCandidate\([\s\S]{0,500}await authorizeAndConsumeOwnerApproval/)
  assert.match(controller, /await adapter\.verifyCandidate\([\s\S]{0,1200}await adapter\.publishImage/)
})

test('documentation mutation uses one fixed controller for push, rollout, observation, and rollback', async () => {
  const workflow = parse(await read('.github/workflows/protected-release.yml'))
  const documentation = workflow.jobs.docs_deploy
  const steps = documentation.steps
  assert.equal(documentation.environment, 'teal-production')
  assert.deepEqual(documentation['runs-on'], ['self-hosted', 'linux', 'teal-production'])
  assert.deepEqual(documentation.permissions, {
    actions: 'read',
    attestations: 'read',
    contents: 'read',
    packages: 'write',
  })
  assert.match(documentation.if, /docs-deploy/)
  assert.match(documentation.if, /github\.repository == 'platypus27\/teal'/)
  assert.match(documentation.if, /github\.ref_protected == true/)
  const verifyIndex = steps.findIndex((step) => step.name === 'Verify protected candidate attestation')
  const delegateIndex = steps.findIndex((step) => step.name === 'Delegate exact candidate to fixed production controller')
  assert.ok(verifyIndex >= 0 && verifyIndex < delegateIndex)
  assert.match(steps[verifyIndex].run, /gh attestation verify/)
  assert.match(steps[verifyIndex].run, /--deny-self-hosted-runners/)
  assert.match(steps[delegateIndex].run, /\/usr\/local\/libexec\/kryv-teal-production-controller deploy/)
  assert.match(steps[delegateIndex].run, /--candidate-sha256 "\$CANDIDATE_SHA256"/)
  assert.match(steps[delegateIndex].run, /--approval-digest "\$APPROVAL_DIGEST"/)
  const workflowSource = JSON.stringify(documentation)
  assert.doesNotMatch(workflowSource, /docker (?:build|push|pull|compose)|ssh |scp |node scripts\//)

  const controller = await read('scripts/kryv_teal_production_controller.mjs')
  for (const required of [
    "['load', '--input'",
    "['push', tag]",
    "'up', '-d', '--no-build', '--wait', 'docs'",
    'previousCandidateSha256',
    'rollbackStatus',
    'observeProductionRelease',
    'current-release.json',
    'observation.json',
    '--retry-all-errors',
    '--retry-connrefused',
  ]) {
    assert.ok(controller.includes(required), `fixed controller must contain ${required}`)
  }
})

test('local production instructions include all immutable image provenance inputs', async () => {
  const readme = await read('README.md')
  assert.match(readme, /--revision "\$\(git rev-parse HEAD\)"/)
  assert.match(readme, /--source https:\/\/github\.com\/platypus27\/teal/)
})

test('direct docs routes use generated records, specialized entries, and bounded initial bundles', async () => {
  const docsPackage = JSON.parse(await read('apps/docs/package.json'))
  assert.match(docsPackage.scripts.generate, /generate:module-index/)
  assert.match(docsPackage.scripts['check:generated'], /generate:module-index -- --check/)
  assert.match(docsPackage.scripts.build, /check:bundle/)
  const registry = await read('apps/docs/src/data/docs-module-registry.js')
  assert.match(registry, /generated\/module-index\.json/)
  assert.doesNotMatch(registry, /module-meta/)
  const catalog = await read('apps/docs/src/data/catalog.jsx')
  assert.match(catalog, /import\.meta\.glob\('\.\.\/generated\/modules\/\*\.json'/)
  assert.doesNotMatch(catalog, /from ['"]\.\/module-meta\.js['"]/)
  const budget = await read('apps/docs/scripts/check-bundle.mjs')
  assert.match(budget, /module-meta/)
  assert.match(budget, /160 \* 1024/)
  assert.match(budget, /\['index\.html', 'module\.html', 'recipes\.html'\]/)

  assert.doesNotMatch(await read('apps/docs/src/bootstrap.jsx'), /react-router/)
  for (const entry of ['main-module.jsx', 'main-recipes.jsx']) {
    const source = await read(`apps/docs/src/${entry}`)
    assert.doesNotMatch(source, /App\.jsx|react-router/)
    assert.match(source, /<Layout>/)
  }

  const vite = await read('apps/docs/vite.config.js')
  assert.match(vite, /module:\s*resolve\(import\.meta\.dirname, 'module\.html'\)/)
  assert.match(vite, /recipes:\s*resolve\(import\.meta\.dirname, 'recipes\.html'\)/)
  const nginx = await read('apps/docs/nginx.conf')
  assert.match(nginx, /location ~ \^\/modules\//)
  assert.match(nginx, /try_files \/module\.html =404;/)
  assert.match(nginx, /try_files \/recipes\.html =404;/)
})

test('public documentation matches the current catalog and fail-closed protected release contract', async () => {
  const readme = await read('README.md')
  const packageReadme = await read('packages/teal/README.md')
  const security = await read('SECURITY.md')
  for (const document of [readme, packageReadme]) {
    assert.match(document, /200 documented module pages across nine groups/)
    assert.doesNotMatch(document, /Twenty-six documented module pages/)
  }
  assert.match(security, /\| 0\.5\.x\s+\| :white_check_mark: \|/)
  assert.doesNotMatch(security, /\| 0\.2\.x\s+\| :white_check_mark: \|/)
  assert.match(await read('apps/docs/src/pages/HomeContent.jsx'), /200 typed modules across nine groups/)
  for (const required of [
    'teal-release',
    'teal-production',
    '.github/workflows/protected-release.yml',
    'infra/release-owner-approval.json',
    'sha256:5bbbce350b985715b402c4af0b8ff88c8a50e25243f848aa4076509bb652403c',
    'source_run_id',
    'source_run_attempt',
    'source_revision',
    'candidate_sha256',
    'approval_manifest_base64',
    'approval_digest',
    'approval_signature',
    'TEAL_OWNER_APPROVAL_PUBLIC_KEY',
    '/usr/local/libexec/kryv-teal-production-controller',
    '/usr/local/share/kryv-teal-production/current',
  ]) {
    assert.ok(readme.includes(required), `release documentation must contain ${required}`)
  }
  const trustAnchor = JSON.parse(await read('infra/release-owner-approval.json'))
  assert.deepEqual(trustAnchor, {
    schemaVersion: 2,
    algorithm: 'Ed25519',
    owner: 'kryv-owner',
    publicKeyFingerprint: 'sha256:5bbbce350b985715b402c4af0b8ff88c8a50e25243f848aa4076509bb652403c',
    repository: 'platypus27/teal',
    workflow: 'platypus27/teal/.github/workflows/protected-release.yml',
    ref: 'refs/heads/master',
    operationEnvironments: {
      'npm-publish': 'teal-release',
      'docs-deploy': 'teal-production',
    },
  })
  assert.equal(
    trustAnchor.publicKeyFingerprint,
    'sha256:5bbbce350b985715b402c4af0b8ff88c8a50e25243f848aa4076509bb652403c',
  )
  for (const required of [
    '"schemaVersion": 3',
    '"decision": "approve"',
    '"owner": "kryv-owner"',
    '"mutations": [',
    '"npm-publish-if-absent"',
    '"github-tag-reconcile"',
    '"github-release-reconcile"',
    '"nonce":',
    '"repository": "platypus27/teal"',
    '"environment": "teal-release"',
    '"workflow": "platypus27/teal/.github/workflows/protected-release.yml"',
    '"ref": "refs/heads/master"',
    '"sourceRunId":',
    '"sourceRunAttempt":',
    '"candidateSha256":',
    'no more than 15 minutes',
  ]) {
    assert.ok(readme.includes(required), `release documentation must contain ${required}`)
  }
  assert.match(readme, /No\s+new\s+publish,\s+push,\s+or\s+deployment\s+is\s+authorized/)
})
