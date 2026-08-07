import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { parse } from 'yaml'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

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
  assert.equal((await read('.nvmrc')).trim(), '24.19.0')
  assert.equal((await read('.node-version')).trim(), '24.19.0')
  assert.equal(rootPackage.packageManager, 'npm@11.19.0')
  assert.deepEqual(rootPackage.engines, { node: '>=24.19.0 <25', npm: '>=11.19.0 <12' })
  assert.equal(rootPackage.scripts['audit:dependencies'], 'npm audit --audit-level=high')
  assert.equal(docsPackage.scripts['install:browser'], 'playwright install')
  assert.equal(docsPackage.scripts.lighthouse, 'lhci autorun --config=../../lighthouserc.cjs')
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

test('all workflow actions are approved immutable SHAs and every job is bounded', async () => {
  const workflow = parse(await read('.github/workflows/pipeline.yml'))
  const approvedActions = new Set([
    'actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1',
    'actions/setup-node@820762786026740c76f36085b0efc47a31fe5020',
    'changesets/action@3841a0683d3cfa6dae0f9bb335290003010fe3f0',
    'docker/login-action@dbcb813823bdd20940b903addbd779551569679f',
    'docker/build-push-action@53b7df96c91f9c12dcc8a07bcb9ccacbed38856a',
  ])
  for (const [name, job] of Object.entries(workflow.jobs)) {
    assert.equal(job['runs-on'], 'ubuntu-24.04', `${name} runner must be pinned`)
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
})

test('trusted release planning, versioning, and publishing are separate least-privilege jobs', async () => {
  const workflow = parse(await read('.github/workflows/pipeline.yml'))
  const { release_plan: plan, release_version: version, release_publish: publish } = workflow.jobs
  assert.deepEqual(plan.permissions, { contents: 'read' })
  assert.ok(plan.needs.includes('production_image'))
  assert.equal(plan.outputs.mode, '${{ steps.plan.outputs.mode }}')
  assert.deepEqual(version.permissions, { contents: 'write', 'pull-requests': 'write' })
  assert.equal(version.permissions['id-token'], undefined)
  assert.equal(version.concurrency['cancel-in-progress'], false)
  const versionAction = version.steps.find((step) => String(step.uses).startsWith('changesets/action@'))
  assert.equal(versionAction.with.commitMode, 'github-api')
  assert.equal(versionAction.with.createGithubReleases, false)
  assert.equal(versionAction.with.publish, undefined)

  assert.deepEqual(publish.permissions, { contents: 'write', 'id-token': 'write' })
  assert.equal(publish.permissions['pull-requests'], undefined)
  assert.equal(publish.concurrency['cancel-in-progress'], false)
  const verifyIndex = publish.steps.findIndex((step) => step.name === 'Verify retained npm artifact')
  const publishIndex = publish.steps.findIndex((step) => String(step.uses).startsWith('changesets/action@'))
  assert.equal(verifyIndex, publishIndex - 1)
  assert.match(publish.steps[verifyIndex].run, /npm run verify:release-package/)
  assert.equal(publish.steps[publishIndex].with.publish, 'npm run publish:package')
  assert.equal(publish.steps[publishIndex].with.createGithubReleases, true)
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
  assert.equal(build.with.load, true)
  assert.equal(build.with.push, false)
  assert.ok(imageJob.steps.some((step) => /npm run verify:docs-image/.test(step.run ?? '')))
  assert.ok(workflow.jobs.release_plan.needs.includes('production_image'))
  assert.ok(workflow.jobs.documentation.needs.includes('production_image'))

  const verifier = await read('scripts/verify-docs-image.mjs')
  for (const required of [
    'docker', 'save', '--output', '--read-only', '--cap-drop', 'ALL',
    'no-new-privileges:true', '--no-build', 'config', '--format', 'json',
    '127.0.0.1', "'port'", '.Image',
  ]) {
    assert.ok(verifier.includes(required), `image verifier must contain ${required}`)
  }
  assert.match(verifier, /teal-integrity-/)
  assert.match(verifier, /delete generatedConfig\.name/)
  assert.match(verifier, /delete network\.name/)
  assert.match(verifier, /aquasec\/trivy:0\.73\.0@sha256:7cced7cae583819fc7806d4cbc0dbbc7cad18b99f7d3e235192e6da8c091045c/)
  assert.doesNotMatch(verifier, /\/var\/run\/docker\.sock|teal-docs-1/)
})

test('documentation deployment pushes the scanned tag and rolls out only immutable digests', async () => {
  const workflow = parse(await read('.github/workflows/pipeline.yml'))
  const steps = workflow.jobs.documentation.steps
  const buildIndex = steps.findIndex((step) => String(step.uses).startsWith('docker/build-push-action@'))
  const verifyIndex = steps.findIndex((step) => /npm run verify:docs-image/.test(step.run ?? ''))
  const loginIndex = steps.findIndex((step) => String(step.uses).startsWith('docker/login-action@'))
  const pushIndex = steps.findIndex((step) => /docker push/.test(step.run ?? ''))
  assert.ok(buildIndex >= 0 && buildIndex < verifyIndex && verifyIndex < loginIndex && loginIndex < pushIndex)
  assert.equal(steps[buildIndex].with.load, true)
  assert.equal(steps[buildIndex].with.push, false)
  const deploy = steps.find((step) => step.name === 'Deploy immutable image with verified rollback')
  assert.ok(deploy)
  for (const required of [
    'IMAGE_DIGEST', 'previous_digest', '@sha256:', 'TEAL_DOCS_IMAGE',
    'docker compose up -d --no-build docs', '.Config.Image', '.Image', 'rollback',
  ]) {
    assert.ok(deploy.run.includes(required), `deployment must contain ${required}`)
  }
  assert.doesNotMatch(deploy.run, /docker compose (?:build|up -d docs)/)
})
