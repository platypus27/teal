# Production Release Integrity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Teal's npm package and documentation image independently reproducible, fail-closed, immutable, and verifiable at their trusted production boundaries.

**Architecture:** Preserve PR 33 as the tested dependency baseline, then add one package-artifact contract shared by lifecycle packing, full consumer verification, and exact-tarball publishing. Split release planning, Changesets versioning, and trusted publishing by privilege. Add a docs-image contract that pins every image input, runs nginx without privilege, scans the exact deploy candidate, and deploys only a GHCR digest.

**Tech Stack:** Node.js 24.19.0, npm 11.19.0, Node test runner, Vitest, Changesets, GitHub Actions, npm trusted publishing/OIDC, Docker Buildx, Docker Compose, nginx-unprivileged, Trivy, Playwright, Lighthouse CI.

---

## File map

- `tests/package-contract.test.mjs` - public tests for declared package files.
- `tests/publish-package.test.mjs` - public tests for retained artifact integrity and publish refusal.
- `tests/production-integrity.test.mjs` - public contracts for workflow privilege/order, immutable actions/images, and hardened Compose behavior.
- `packages/teal/scripts/package-contract.mjs` - entry-point, safe archive inspection, built-file byte comparison, and digest validation.
- `packages/teal/scripts/create-package-artifact.mjs` - build and create one retained npm tarball plus its descriptor.
- `packages/teal/scripts/prepack-package.mjs` - lifecycle defense for direct `npm pack` and directory-based `npm publish`.
- `packages/teal/scripts/publish-package.mjs` - validate and publish the retained exact tarball.
- `packages/teal/scripts/verify-package.mjs` - retain existing consumer checks while accepting a retained artifact mode.
- `scripts/verify-docs-image.mjs` - scan and smoke-test an exact local docs image under hardened Compose settings.
- `package.json`, `packages/teal/package.json`, `apps/docs/package.json` - exact toolchain and locked integrity/release commands.
- `.nvmrc`, `.node-version`, `package-lock.json`, `.gitignore` - exact runtime, dependencies, and ignored artifacts.
- `.github/workflows/pipeline.yml` - current action pins, timeouts, image gate, and least-privilege release jobs.
- `apps/docs/Dockerfile`, `apps/docs/nginx.conf`, `docker-compose.yml` - immutable non-root docs runtime.
- `packages/teal/test/authentik/docker-compose.yml` - exact fixture versions and digests.
- `README.md`, `CONTRIBUTING.md` - locked local commands and release-gate description.

### Task 1: Integrate the reviewed PR 33 baseline unchanged

**Files:**
- Preserve: `apps/docs/tests/docs.spec.js-snapshots/button-module-light-chromium-linux.png`
- Merge: `origin/dep-integration`

- [ ] **Step 1: Record the reviewed head and visual blob**

Run:

```bash
git rev-parse origin/dep-integration
git rev-list --count origin/master..origin/dep-integration
git rev-parse origin/dep-integration:apps/docs/tests/docs.spec.js-snapshots/button-module-light-chromium-linux.png
```

Expected: head `4ecb63715f918ff5000af6cd408a9ecac176cfe8`, count `6`, and one baseline blob SHA.

- [ ] **Step 2: Merge without squashing or rewriting**

Run:

```bash
git merge --no-ff origin/dep-integration -m "merge: integrate reviewed dependency baseline"
```

Expected: one merge commit whose second parent is `4ecb63715f918ff5000af6cd408a9ecac176cfe8`.

- [ ] **Step 3: Prove all commits and the baseline were preserved**

Run:

```bash
git merge-base --is-ancestor 4ecb63715f918ff5000af6cd408a9ecac176cfe8 HEAD
test "$(git rev-parse HEAD:apps/docs/tests/docs.spec.js-snapshots/button-module-light-chromium-linux.png)" = "$(git rev-parse origin/dep-integration:apps/docs/tests/docs.spec.js-snapshots/button-module-light-chromium-linux.png)"
git diff --exit-code origin/dep-integration -- apps/docs/tests/docs.spec.js-snapshots
```

Expected: all commands exit 0. Do not edit thresholds or snapshots later.

### Task 2: Establish failing production-integrity contracts

**Files:**
- Create: `tests/package-contract.test.mjs`
- Create: `tests/production-integrity.test.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install only test infrastructure and locked LHCI**

Run under Node 24.19.0:

```bash
npm install --save-dev --save-exact yaml@2.9.0 @lhci/cli@0.15.1 tar@7.5.22
```

Expected: root `devDependencies` and lockfile change; PR 33 versions otherwise remain intact. `tar` is a direct dependency of the release verifier so archive parsing does not depend on a transitive install.

- [ ] **Step 2: Add package-artifact red tests**

Create `tests/package-contract.test.mjs`:

```js
import assert from 'node:assert/strict'
import test from 'node:test'

import {
  assertSafeArchivePath,
  assertPackedFiles,
} from '../packages/teal/scripts/package-contract.mjs'

const packageJson = {
  name: '@kryv/teal',
  version: '0.4.1',
  main: './dist/index.js',
  module: './dist/index.js',
  types: './dist/index.d.ts',
  exports: {
    '.': { types: './dist/index.d.ts', import: './dist/index.js' },
    './styles.css': './dist/styles.css',
  },
}

test('rejects a pack manifest without declared exports', () => {
  assert.throws(
    () => assertPackedFiles({
      packageJson,
      packedFiles: ['package.json', 'src/index.ts'],
      builtDistFiles: ['dist/index.js', 'dist/index.d.ts', 'dist/styles.css'],
    }),
    /missing declared package files.*dist\/index\.js/i,
  )
})

test('rejects a pack manifest that omits any built dist file', () => {
  assert.throws(
    () => assertPackedFiles({
      packageJson,
      packedFiles: ['package.json', 'dist/index.js', 'dist/index.d.ts', 'dist/styles.css'],
      builtDistFiles: ['dist/index.js', 'dist/index.d.ts', 'dist/styles.css', 'dist/index.js.map'],
    }),
    /missing built dist files.*dist\/index\.js\.map/i,
  )
})

test('accepts a complete exact pack manifest', () => {
  assert.doesNotThrow(() => assertPackedFiles({
    packageJson,
    packedFiles: ['package.json', 'dist/index.js', 'dist/index.d.ts', 'dist/styles.css'],
    builtDistFiles: ['dist/index.js', 'dist/index.d.ts', 'dist/styles.css'],
  }))
})

test('rejects archive traversal, absolute paths, backslashes, NULs, and duplicates', () => {
  for (const path of ['package/../escape', '/package/dist/index.js', 'package\\dist\\index.js', 'package/\0bad']) {
    assert.throws(() => assertSafeArchivePath(path, new Set()), /unsafe archive path/i)
  }
  const seen = new Set()
  assert.equal(assertSafeArchivePath('package/dist/index.js', seen), 'package/dist/index.js')
  assert.throws(() => assertSafeArchivePath('package/dist/index.js', seen), /duplicate archive path/i)
})

```

- [ ] **Step 3: Add workflow and container red tests**

Create `tests/production-integrity.test.mjs`:

```js
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { parse } from 'yaml'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('trusted publishing is a fresh exact-artifact job with least privilege', async () => {
  const workflow = parse(await read('.github/workflows/pipeline.yml'))
  const publish = workflow.jobs.release_publish
  assert.deepEqual(publish.permissions, { contents: 'write', 'id-token': 'write' })
  assert.equal(publish.concurrency['cancel-in-progress'], false)
  assert.ok(Number.isInteger(publish['timeout-minutes']))
  const steps = publish.steps.map((step) => step.name ?? step.run ?? step.uses)
  assert.ok(steps.some((value) => /verify retained npm artifact/i.test(value)))
  assert.ok(steps.some((value) => /changesets\/action@[0-9a-f]{40}$/.test(value)))
  const checkout = publish.steps.find((step) => String(step.uses).startsWith('actions/checkout@'))
  assert.equal(checkout.with['persist-credentials'], false)
})

test('all workflow actions use immutable full SHAs and jobs have timeouts', async () => {
  const workflow = parse(await read('.github/workflows/pipeline.yml'))
  for (const [name, job] of Object.entries(workflow.jobs)) {
    assert.ok(Number.isInteger(job['timeout-minutes']), `${name} needs timeout-minutes`)
    for (const step of job.steps ?? []) {
      if (step.uses) assert.match(step.uses, /^[^@]+@[0-9a-f]{40}$/)
    }
  }
})

test('Dockerfile stages and Authentik fixtures are exact digest identities', async () => {
  const dockerfile = await read('apps/docs/Dockerfile')
  for (const line of dockerfile.split('\n').filter((line) => line.startsWith('FROM '))) {
    assert.match(line, /^FROM [^:\s]+:[^@\s]+@sha256:[0-9a-f]{64}(?: AS \w+)?$/)
  }
  const fixture = parse(await read('packages/teal/test/authentik/docker-compose.yml'))
  for (const service of Object.values(fixture.services)) {
    assert.match(service.image, /^[^:\s]+(?:\/[^:\s]+)*:[^@\s]+@sha256:[0-9a-f]{64}$/)
  }
})

test('docs runtime is unprivileged, read-only, loopback-only, and pullable by digest', async () => {
  const composeText = await read('docker-compose.yml')
  const docs = parse(composeText).services.docs
  assert.match(docs.image, /\$\{TEAL_DOCS_IMAGE:/)
  assert.equal(docs.user, '101:101')
  assert.equal(docs.read_only, true)
  assert.deepEqual(docs.cap_drop, ['ALL'])
  assert.ok(docs.security_opt.includes('no-new-privileges:true'))
  assert.ok(docs.ports.includes('127.0.0.1:8087:8080'))
  assert.ok(docs.tmpfs.some((entry) => entry.startsWith('/tmp:')))
  assert.ok(docs.healthcheck)
  assert.doesNotMatch(composeText, /pull_policy:\s*never/)
})
```

- [ ] **Step 4: Wire and run the red test command**

Add to root `package.json`:

```json
"test:integrity": "node --test tests/*.test.mjs"
```

Also insert `npm run test:integrity` into the root `verify` chain immediately
after unit tests so the public release contracts are always blocking.

Run:

```bash
npm run test:integrity
```

Expected: FAIL because the new modules, split release jobs, image digests, and Compose hardening do not exist.

### Task 3: Implement the exact package-file contract

**Files:**
- Create: `packages/teal/scripts/package-contract.mjs`
- Test: `tests/package-contract.test.mjs`

- [ ] **Step 1: Implement declared-target traversal and manifest validation**

Create `packages/teal/scripts/package-contract.mjs`:

```js
import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { posix } from 'node:path'

export function assertSafeArchivePath(path, seen) {
  if (
    typeof path !== 'string' || path.includes('\0') || path.includes('\\') ||
    path.startsWith('/') || path.split('/').includes('..')
  ) {
    throw new Error(`Unsafe archive path: ${path}`)
  }
  const normalized = posix.normalize(path).replace(/^\.\//, '')
  if (normalized !== 'package' && !normalized.startsWith('package/')) {
    throw new Error(`Unsafe archive path outside package/: ${path}`)
  }
  if (seen.has(normalized)) throw new Error(`Duplicate archive path: ${normalized}`)
  seen.add(normalized)
  return normalized
}

function collectTargets(value, targets) {
  if (typeof value === 'string') {
    if (value.startsWith('./')) {
      const target = value.slice(2)
      if (target === '' || target.startsWith('../') || target.includes('/../')) {
        throw new Error(`Declared package target escapes the package: ${value}`)
      }
      targets.add(target)
    }
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) collectTargets(item, targets)
    return
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectTargets(item, targets)
  }
}

export function declaredPackageFiles(packageJson) {
  const targets = new Set()
  for (const field of ['main', 'module', 'types']) collectTargets(packageJson[field], targets)
  collectTargets(packageJson.exports, targets)
  return [...targets].sort()
}

export function assertPackedFiles({ packageJson, packedFiles, builtDistFiles }) {
  const packed = new Set(packedFiles.map((file) => file.replace(/^package\//, '')))
  const declaredMissing = declaredPackageFiles(packageJson).filter((file) => !packed.has(file))
  if (declaredMissing.length) {
    throw new Error(`Exact tarball is missing declared package files: ${declaredMissing.join(', ')}`)
  }
  const dist = [...packed].filter((file) => file.startsWith('dist/'))
  if (dist.length === 0) throw new Error('Exact tarball contains no dist files')
  const builtMissing = builtDistFiles.filter((file) => !packed.has(file))
  if (builtMissing.length) {
    throw new Error(`Exact tarball is missing built dist files: ${builtMissing.join(', ')}`)
  }
}

export function sha512Integrity(path) {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha512')
    const stream = createReadStream(path)
    stream.on('error', reject)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolve(`sha512-${hash.digest('base64')}`))
  })
}
```

- [ ] **Step 2: Run focused tests**

Run:

```bash
node --test --test-name-pattern="pack manifest" tests/package-contract.test.mjs
```

Expected: pack-manifest tests PASS; retained publisher test remains red.

- [ ] **Step 3: Commit the contract and red public tests**

```bash
git add packages/teal/scripts/package-contract.mjs tests/package-contract.test.mjs tests/production-integrity.test.mjs package.json package-lock.json
git commit -m "test: define production integrity contracts"
```

### Task 4: Build, retain, verify, and publish one exact tarball

**Files:**
- Create: `packages/teal/scripts/create-package-artifact.mjs`
- Create: `packages/teal/scripts/prepack-package.mjs`
- Create: `packages/teal/scripts/publish-package.mjs`
- Modify: `packages/teal/scripts/verify-package.mjs`
- Modify: `packages/teal/package.json`
- Modify: `package.json`
- Modify: `.gitignore`
- Create: `tests/publish-package.test.mjs`

- [ ] **Step 1: Add red version and publish-target tests**

Create `tests/publish-package.test.mjs` with changed-byte, full-source-commit,
archive-derived package identity, exact publish target, and symlink rejection
cases:

```js
import assert from 'node:assert/strict'
import { mkdir, mkdtemp, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { create as createTar } from 'tar'

import { sha512Integrity } from '../packages/teal/scripts/package-contract.mjs'
import {
  publishValidatedArtifact,
  validateReleaseArtifact,
} from '../packages/teal/scripts/publish-package.mjs'

const packageJson = {
  name: '@kryv/teal',
  version: '0.4.1',
  main: './dist/index.js',
  module: './dist/index.js',
  types: './dist/index.d.ts',
  exports: { './styles.css': './dist/styles.css' },
}
const sourceCommit = '0123456789abcdef0123456789abcdef01234567'

async function artifactFixture(archivedPackageJson = packageJson) {
  const artifactDirectory = await mkdtemp(join(tmpdir(), 'teal-publish-contract-'))
  const packageRoot = join(artifactDirectory, 'package')
  await mkdir(join(packageRoot, 'dist'), { recursive: true })
  await writeFile(join(packageRoot, 'package.json'), JSON.stringify(archivedPackageJson))
  await writeFile(join(packageRoot, 'dist/index.js'), 'export const teal = true\n')
  await writeFile(join(packageRoot, 'dist/index.d.ts'), 'export declare const teal: true\n')
  await writeFile(join(packageRoot, 'dist/styles.css'), ':root { --teal: 1; }\n')
  const tarballPath = join(artifactDirectory, 'kryv-teal-0.4.1.tgz')
  await createTar({ cwd: artifactDirectory, file: tarballPath, gzip: true }, ['package'])
  return {
    artifactDirectory,
    packageRoot,
    descriptor: {
      tarballPath,
      integrity: await sha512Integrity(tarballPath),
      sourceCommit,
    },
  }
}

test('rejects a retained artifact whose bytes changed', async () => {
  const fixture = await artifactFixture()
  await writeFile(fixture.descriptor.tarballPath, 'changed bytes')
  await assert.rejects(
    validateReleaseArtifact({ ...fixture, currentPackageJson: packageJson, currentSourceCommit: sourceCommit }),
    /artifact integrity mismatch/i,
  )
})

test('binds the retained artifact to the full source commit', async () => {
  const fixture = await artifactFixture()
  await assert.rejects(
    validateReleaseArtifact({
      ...fixture,
      descriptor: { ...fixture.descriptor, sourceCommit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
      currentPackageJson: packageJson,
      currentSourceCommit: sourceCommit,
    }),
    /source commit mismatch/i,
  )
})

test('derives package identity from the exact tarball', async () => {
  const fixture = await artifactFixture({ ...packageJson, version: '0.4.0' })
  await assert.rejects(
    validateReleaseArtifact({
      ...fixture,
      currentPackageJson: packageJson,
      currentSourceCommit: sourceCommit,
    }),
    /archive package version mismatch/i,
  )
})

test('publishes only the validated retained tarball', async () => {
  const fixture = await artifactFixture()
  const validated = await validateReleaseArtifact({
    ...fixture,
    currentPackageJson: packageJson,
    currentSourceCommit: sourceCommit,
  })
  const calls = []
  await publishValidatedArtifact(validated, async (command, args) => {
    calls.push({ command, args })
  })
  assert.deepEqual(calls, [{
    command: 'npm',
    args: ['publish', fixture.descriptor.tarballPath, '--access', 'public', '--provenance'],
  }])
})

test('rejects symlink ambiguity in the exact tarball', async () => {
  const fixture = await artifactFixture()
  await symlink('index.js', join(fixture.packageRoot, 'dist/linked.js'))
  await createTar({ cwd: fixture.artifactDirectory, file: fixture.descriptor.tarballPath, gzip: true }, ['package'])
  fixture.descriptor.integrity = await sha512Integrity(fixture.descriptor.tarballPath)
  await assert.rejects(
    validateReleaseArtifact({
      ...fixture,
      currentPackageJson: packageJson,
      currentSourceCommit: sourceCommit,
    }),
    /symbolic link|link entry/i,
  )
})
```

Run the focused test and expect FAIL because the publisher interface is absent.

- [ ] **Step 2: Implement retained artifact creation**

`create-package-artifact.mjs` must expose:

```js
export async function createPackageArtifact({
  artifactDirectory,
  build = true,
  packageRoot,
  workspaceRoot,
})
```

It must run `scripts/build.mjs` when requested, recursively list regular `dist/` files, run:

```text
npm pack --ignore-scripts --json --workspace @kryv/teal --pack-destination <artifactDirectory>
```

Then call `assertPackedFiles` on the returned `files[].path`, calculate SHA-512, and return the absolute tarball path, manifest, built list, name, and version. Use a unique temporary directory for normal verification, not fixed `/tmp/teal-package-check`.

Resolve `git rev-parse HEAD`, require a full 40-character commit, and carry it
into the retained descriptor. Release mode must also reject tracked worktree
changes so the descriptor identifies the exact reviewed source checkout.

- [ ] **Step 3: Implement lifecycle defense**

`prepack-package.mjs` must build, run nested:

```text
npm pack --dry-run --ignore-scripts --json
```

from `packages/teal`, collect current built `dist/` files, and call `assertPackedFiles`.

Add to `packages/teal/package.json`:

```json
"prepack": "node scripts/prepack-package.mjs",
"publint:artifact": "publint run --strict"
```

The inner `--ignore-scripts` prevents recursion. The outer `npm pack` and directory publish still run `prepack`.

- [ ] **Step 4: Retain only a fully verified artifact**

Refactor `verify-package.mjs` to call `createPackageArtifact` once. Accept:

```text
--artifact-directory <path>
--keep-artifact
```

Run every existing Publint, declaration-map, React 18/19, ESM, SSR, Tailwind, Vite, CSS, and Chromium assertion against that tarball. Replace consumer `npm exec` with temporary package scripts:

```json
{
  "scripts": {
    "build": "vite build",
    "build:css": "tailwindcss -c tailwind.config.js -i tailwind-input.css -o public-utilities.css --minify"
  }
}
```

Invoke Publint through `npm run publint:artifact --workspace @kryv/teal -- <tarball>`.

Only after all checks pass, write `artifact.json` with:

```json
{
  "tarballPath": "/absolute/path/kryv-teal-0.4.1.tgz",
  "integrity": "sha512-...",
  "sourceCommit": "0123456789abcdef0123456789abcdef01234567"
}
```

The verifier may log the npm pack manifest as evidence, but the publisher must
not accept descriptor-supplied package identity or file lists as authority.

Normal verification cleans its temporary artifact. Retained mode keeps it.

- [ ] **Step 5: Implement exact-artifact publishing**

`publish-package.mjs` must export:

```js
export async function validateReleaseArtifact({
  artifactDirectory,
  currentPackageJson,
  currentSourceCommit,
  descriptor,
  packageRoot,
})
export async function publishValidatedArtifact(descriptor, run = runCommand)
```

Validation must recompute SHA-512, inspect the exact archive with `tar`, and
derive its package identity and entries from archived bytes. Reject absolute
paths, `..` traversal, backslash ambiguity, NULs, entries outside `package/`,
duplicate normalized paths, symbolic links, hard links, and any non-file type
other than a directory. Read `package/package.json` from the archive, derive
its declared targets, and validate them against the archive file set.

Hash every regular archive `package/dist/**` entry and every current regular
`packages/teal/dist/**` file. Require identical relative path sets and
byte-for-byte SHA-256 hashes, which rejects missing, extra, or stale build
output. Require archive name/version to match current package name/version,
descriptor `sourceCommit` to equal the full current checkout commit, and the
tracked checkout to remain clean.

The CLI loads `.release/npm/artifact.json` and calls only:

```js
await run('npm', [
  'publish',
  validated.tarballPath,
  '--access',
  'public',
  '--provenance',
])
```

`runCommand` is a private `execFile` wrapper with inherited stdout/stderr so
Changesets can parse npm's normal published-package output.

Do not add a production dry-run bypass. Preserve stdout for Changesets published-package discovery.

- [ ] **Step 6: Wire scripts and ignored output**

Add root scripts:

```json
"verify:release-package": "node packages/teal/scripts/verify-package.mjs --artifact-directory .release/npm --keep-artifact",
"publish:package": "node packages/teal/scripts/publish-package.mjs .release/npm/artifact.json"
```

Add `/.release/` to `.gitignore`.

- [ ] **Step 7: Run package red-green evidence**

Run:

```bash
npm run test:integrity
npm pack --workspace @kryv/teal --dry-run --json
npm run verify:release-package
node -e "const d=require('./.release/npm/artifact.json'); if (!/^[0-9a-f]{40}$/.test(d.sourceCommit)) process.exit(1)"
```

Expected: tests PASS, raw pack runs prepack and includes all declared/built files, and retained verification prints `Verified @kryv/teal@0.4.1`. Do not invoke publish.

- [ ] **Step 8: Commit**

```bash
git add .gitignore package.json packages/teal/package.json packages/teal/scripts tests/publish-package.test.mjs
git commit -m "fix: make npm artifacts fail closed"
```

### Task 5: Pin local tools and split the trusted release workflow

**Files:**
- Modify: `.nvmrc`
- Modify: `.node-version`
- Modify: `package.json`
- Modify: `apps/docs/package.json`
- Modify: `package-lock.json`
- Modify: `.github/workflows/pipeline.yml`
- Modify: `tests/production-integrity.test.mjs`
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`

- [ ] **Step 1: Extend red workflow tests**

Assert these exact actions:

```js
const expectedActions = new Set([
  'actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1',
  'actions/setup-node@820762786026740c76f36085b0efc47a31fe5020',
  'changesets/action@3841a0683d3cfa6dae0f9bb335290003010fe3f0',
  'docker/login-action@dbcb813823bdd20940b903addbd779551569679f',
  'docker/build-push-action@53b7df96c91f9c12dcc8a07bcb9ccacbed38856a',
])
```

Assert workflow text has no `npx `, verifier text has no `npm exec`, `release_version` lacks `id-token`, and `release_publish` lacks `pull-requests`.

Run focused tests. Expected: FAIL against current workflow.

- [ ] **Step 2: Pin Node and npm**

Set `.nvmrc` and `.node-version` to:

```text
24.19.0
```

Set root metadata:

```json
"packageManager": "npm@11.19.0",
"engines": {
  "node": ">=24.19.0 <25",
  "npm": ">=11.19.0 <12"
}
```

Every CI job installs `npm@11.19.0` exactly before `npm ci`.

- [ ] **Step 3: Replace runtime fetches**

Add docs scripts:

```json
"install:browser": "playwright install",
"lighthouse": "lhci autorun --config=../../lighthouserc.cjs"
```

Change root `release:version` from `npx changeset version` to `changeset version`. CI uses:

```text
npm run install:browser --workspace @kryv/teal-docs -- --with-deps <browser>
npm run lighthouse --workspace @kryv/teal-docs
```

The Quality job runs `npm run test:integrity` after unit tests.

- [ ] **Step 4: Split release planning, versioning, and publishing**

Replace the old release job with three jobs. Required public shape:

```yaml
release_plan:
  if: ${{ github.event_name == 'push' && github.ref == 'refs/heads/master' }}
  needs: [quality, browser, lighthouse, production_image]
  timeout-minutes: 5
  permissions:
    contents: read
  outputs:
    mode: ${{ steps.plan.outputs.mode }}

release_version:
  if: ${{ needs.release_plan.outputs.mode == 'version' }}
  needs: release_plan
  timeout-minutes: 15
  concurrency:
    group: pipeline-release-version-master
    cancel-in-progress: false
  permissions:
    contents: write
    pull-requests: write
  # checkout fetch-depth:0 and persist-credentials:false
  # npm ci --ignore-scripts
  # changesets/action exact pin, version command, commitMode: github-api

release_publish:
  if: ${{ needs.release_plan.outputs.mode == 'publish' }}
  needs: release_plan
  timeout-minutes: 35
  concurrency:
    group: pipeline-release-publish-master
    cancel-in-progress: false
  permissions:
    contents: write
    id-token: write
  # clean checkout, exact npm, npm ci --ignore-scripts, local Chromium
  # named "Verify retained npm artifact" step
  # changesets/action exact pin with publish command and GitHub releases
```

Planning emits exactly `version`, `publish`, or `none`. Only confirmed registry 404 responses count as unpublished; all other registry failures exit 1.

Versioning uses `commitMode: github-api`, no OIDC, and `createGithubReleases: false`. Publishing independently runs `npm run verify:release-package` immediately before Changesets, then uses `publish: npm run publish:package`, `createGithubReleases: true`, and `NPM_CONFIG_PROVENANCE: true`.

- [ ] **Step 5: Update every action, checkout, timeout, and concurrency contract**

Use only the five approved full SHAs. Add `timeout-minutes` to every job and `persist-credentials: false` to every checkout. PR runs may cancel stale work. Version, publish, and active deployment mutation do not cancel midway.

- [ ] **Step 6: Update documentation and run tests**

Document exact Node/npm and locked scripts without changing performance or visual gates.

Run:

```bash
npm run test:integrity
git diff --check
```

Expected: package and workflow tests PASS; image contracts remain red until Task 6.

- [ ] **Step 7: Commit**

```bash
git add .nvmrc .node-version package.json package-lock.json apps/docs/package.json .github/workflows/pipeline.yml README.md CONTRIBUTING.md tests/production-integrity.test.mjs
git commit -m "ci: verify exact package before trusted publish"
```

### Task 6: Pin and harden every docs and fixture image

**Files:**
- Modify: `apps/docs/Dockerfile`
- Modify: `apps/docs/nginx.conf`
- Modify: `docker-compose.yml`
- Modify: `packages/teal/test/authentik/docker-compose.yml`
- Test: `tests/production-integrity.test.mjs`

- [ ] **Step 1: Extend and run red image contracts**

Assert exact Node/nginx identities, `USER 101:101`, `EXPOSE 8080`, healthcheck, nginx port and `/healthz`, unchanged CSP/Referrer/Permissions headers, and exact fixture identities.

Run:

```bash
node --test --test-name-pattern="Dockerfile|runtime|fixture" tests/production-integrity.test.mjs
```

Expected: FAIL on all current floating/privileged inputs.

- [ ] **Step 2: Pin Dockerfile and use unprivileged nginx**

Use:

```dockerfile
FROM node:24.19.0-alpine3.24@sha256:d32cdf619f63fe0471182d08996dd516c6275bb5fd31ae06e55a570bd9e1ad43 AS build
# install npm@11.19.0 exactly, npm ci, and build both workspaces

FROM nginxinc/nginx-unprivileged:1.30.4-alpine3.24@sha256:44e36330f74d4f3a1d4e222acca9e23b401fb87811a7597024502bb759c4dd49 AS serve
COPY --from=build --chown=101:101 /app/apps/docs/dist /usr/share/nginx/html
COPY --chown=101:101 apps/docs/nginx.conf /etc/nginx/conf.d/default.conf
USER 101:101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 3: Update nginx while retaining headers**

Change `listen 80` to `listen 8080` and add:

```nginx
location = /healthz {
    access_log off;
    default_type text/plain;
    return 200 "ok\n";
}
```

Do not change existing CSP or other security header values.

- [ ] **Step 4: Harden Compose without blocking immutable pulls**

Add:

```yaml
user: '101:101'
read_only: true
cap_drop: [ALL]
security_opt:
  - no-new-privileges:true
tmpfs:
  - /tmp:rw,noexec,nosuid,nodev,size=16m,mode=1777
ports:
  - '127.0.0.1:8087:8080'
healthcheck:
  test: ['CMD', 'wget', '-q', '-O', '/dev/null', 'http://127.0.0.1:8080/healthz']
  interval: 10s
  timeout: 3s
  retries: 6
  start_period: 5s
```

Keep `${TEAL_DOCS_IMAGE:-ghcr.io/platypus27/teal-docs:local}` and the build section. Do not add `pull_policy: never`.

- [ ] **Step 5: Pin fixture images**

Use exactly:

```text
postgres:16.14-alpine3.24@sha256:57c72fd2a128e416c7fcc499958864df5301e940bca0a56f58fddf30ffc07777
redis:7.4.10-alpine3.21@sha256:e7723ff73d963f5cc6d9c4643ea3d989527a402a319239054e9472a7fb9219a2
ghcr.io/goauthentik/server:2026.5.6@sha256:ed120caf710ccf82ef0026f0bc74e51615bc95ebff228a7a2d6fc60c441c3868
```

Use the Authentik identity for both server and worker.

- [ ] **Step 6: Run validation and commit**

Run:

```bash
npm run test:integrity
docker compose config --quiet
docker compose -f packages/teal/test/authentik/docker-compose.yml config --quiet
```

Expected: PASS.

Commit:

```bash
git add apps/docs/Dockerfile apps/docs/nginx.conf docker-compose.yml packages/teal/test/authentik/docker-compose.yml tests/production-integrity.test.mjs
git commit -m "fix: harden immutable docs runtime"
```

### Task 7: Scan and smoke-test the exact docs deploy candidate

**Files:**
- Create: `scripts/verify-docs-image.mjs`
- Modify: `package.json`
- Modify: `.github/workflows/pipeline.yml`
- Modify: `tests/production-integrity.test.mjs`

- [ ] **Step 1: Add and run red production-image assertions**

Assert `production_image` exists, uses the approved Buildx action with `load:
true`, invokes `npm run verify:docs-image`, and gates release planning/docs
deployment. Assert `scripts/verify-docs-image.mjs` contains `docker save`,
`--read-only`, `--cap-drop`, `ALL`, `no-new-privileges:true`, a unique Compose
project name, dynamic loopback port resolution, and `--no-build`, while it does
not contain `/var/run/docker.sock` or the default project/container name.

Assert deployment scans before push, pushes the scanned tag, resolves a
repository digest, passes that digest through `TEAL_DOCS_IMAGE`, uses
`--no-build`, proves the running container image ID/reference, and rolls back
only to a previously captured `@sha256:` reference.

Expected focused test result: FAIL.

- [ ] **Step 2: Implement exact local image verification**

Create `scripts/verify-docs-image.mjs` with CLI `--image <tag>`. It must:

1. Reject empty or option-like image names.
2. Create a unique temporary directory and Compose project name such as
   `teal-integrity-<pid>-<randomhex>`.
3. Run `docker image inspect` to bind evidence to the current local image ID,
   then `docker save --output <temp>/image.tar <tag>` exactly once.
4. Run `aquasec/trivy:0.73.0@sha256:7cced7cae583819fc7806d4cbc0dbbc7cad18b99f7d3e235192e6da8c091045c`
   with `--read-only`, `--cap-drop ALL`,
   `--security-opt no-new-privileges:true`, a bounded `/tmp` tmpfs, the Docker
   archive mounted read-only at `/scan/image.tar`, and a unique writable cache
   directory. Never mount `/var/run/docker.sock`.
5. Scan `--input /scan/image.tar` for fixable HIGH/CRITICAL vulnerabilities
   with `--scanners vuln --severity HIGH,CRITICAL --ignore-unfixed --exit-code
   1`, then run a separate `--scanners secret --exit-code 1` archive scan.
6. Resolve `docker compose config --format json`, replace the docs image with
   the exact local tag, remove its build key, and replace its port with a
   dynamically allocated `127.0.0.1` host port targeting container port 8080.
   Write that generated config only inside the unique temporary directory.
7. Start only that generated config with `docker compose --project-name
   <unique> --file <generated> up -d --no-build docs`.
8. Resolve the assigned port with the same project/file arguments, poll until
   healthy or 60 seconds, and require HTTP 200 from `/healthz` and `/` plus CSP,
   Referrer-Policy, and Permissions-Policy on `/`.
9. Prove the running container `.Image` equals the inspected local image ID.
10. In `finally`, run `docker compose --project-name <unique> --file
    <generated> down --remove-orphans` only for that disposable project, then
    remove only its unique temporary directory.

Use `execFile` or `spawn` argument arrays only. Do not interpolate a shell
command or target the live repository-default Compose project.

- [ ] **Step 3: Add script and non-mutating image job**

Add:

```json
"verify:docs-image": "node scripts/verify-docs-image.mjs"
```

The `production_image` job has `contents: read`, timeout, exact checkout/Buildx pins, `persist-credentials: false`, `push: false`, `load: true`, and local tag `teal-docs:verify-${{ github.sha }}`. Run the verifier against that tag.

- [ ] **Step 4: Make deployment repeat verification on its own candidate**

The documentation job must:

1. Build/load `ghcr.io/${GITHUB_REPOSITORY,,}/teal-docs:${GITHUB_SHA}`.
2. Run the same scan/smoke verifier before login/push.
3. Login with exact v4.6.0 action pin.
4. Push the already-scanned local tag.
5. Resolve/validate its repository digest.
6. Capture the remote container's previous immutable repository digest. If its
   configured reference is not already `@sha256:`, resolve its current local
   image ID to a matching GHCR `RepoDigest` and fail if none exists.
7. Pull and deploy `ghcr.io/.../teal-docs@sha256:...` with `docker compose up
   -d --no-build docs`.
8. Compare the running container's configured image reference with the pushed
   digest, and compare its `.Image` ID with `docker image inspect <digest>
   --format '{{.Id}}'`.
9. On failed digest proof or health, restore the previously captured immutable
   digest with `docker compose up -d --no-build docs` and verify rollback
   health.

Do not set `pull_policy: never`.

- [ ] **Step 5: Run static and dynamic evidence**

Run:

```bash
npm run test:integrity
docker build -f apps/docs/Dockerfile -t teal-docs:production-integrity .
npm run verify:docs-image -- --image teal-docs:production-integrity
git diff --check
```

Expected: contracts pass, pinned images resolve, no fixable HIGH/CRITICAL vulnerabilities, no secrets, healthy runtime, and required headers. Update a vulnerable base version/digest instead of suppressing a real finding.

- [ ] **Step 6: Commit**

```bash
git add scripts/verify-docs-image.mjs package.json .github/workflows/pipeline.yml tests/production-integrity.test.mjs
git commit -m "ci: scan exact docs deploy artifact"
```

### Task 8: Full verification and mandatory two-axis review

**Files:**
- Review all changes since: `a65fbb02b3965715cc241e3cdc3aad7b6ccc546c`
- Preserve: all PR 33 snapshots and thresholds

- [ ] **Step 1: Confirm toolchain and clean install**

Run:

```bash
node --version
npm --version
npm ci
```

Expected: Node `v24.19.0`, npm `11.19.0`, clean install succeeds.

- [ ] **Step 2: Run the complete repository gate**

Run:

```bash
npm run verify
```

Expected: lint, typecheck, integrity/unit/generated/registry/build gates, clean package lifecycle, exact tarball, and React consumer verification all PASS.

- [ ] **Step 3: Run every browser project**

Run:

```bash
npm run install:browser --workspace @kryv/teal-docs -- --with-deps chromium
npm run install:browser --workspace @kryv/teal-docs -- --with-deps firefox
npm run install:browser --workspace @kryv/teal-docs -- --with-deps webkit
npm run test:e2e --workspace @kryv/teal-docs -- --project=chromium
npm run test:e2e --workspace @kryv/teal-docs -- --project=mobile-chromium
npm run test:e2e --workspace @kryv/teal-docs -- --project=firefox
npm run test:e2e --workspace @kryv/teal-docs -- --project=webkit
```

Expected: all four pass. Investigate failures. Do not change snapshots or thresholds.

- [ ] **Step 4: Re-run package and image production evidence**

Run:

```bash
npm run verify:release-package
docker build -f apps/docs/Dockerfile -t teal-docs:production-integrity .
npm run verify:docs-image -- --image teal-docs:production-integrity
docker compose config --quiet
docker compose -f packages/teal/test/authentik/docker-compose.yml config --quiet
```

Expected: all pass. Do not run `npm run publish:package`.

- [ ] **Step 5: Verify hygiene and protected baseline**

Run:

```bash
git diff --check
git diff --exit-code origin/dep-integration -- apps/docs/tests/docs.spec.js-snapshots
git grep -nIE '(npm_[A-Za-z0-9]{36}|ghp_[A-Za-z0-9]{36}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----)' -- ':!package-lock.json'
git status --short --branch
```

Expected: no whitespace errors, snapshot changes, secrets, or uncommitted implementation work.

- [ ] **Step 6: Invoke mandatory review**

Run Standards and Spec reviews in parallel against fixed baseline `a65fbb02b3965715cc241e3cdc3aad7b6ccc546c` and:

```text
docs/superpowers/specs/2026-08-07-production-release-integrity-design.md
```

Expected: no unresolved blocking findings. Fix real findings test-first and repeat relevant verification.

- [ ] **Step 7: Commit review fixes if any**

Use `<action>: <description>`, never co-author lines, and never manually edit generated changelogs.

- [ ] **Step 8: Report bounded completion without mutation**

Separate local and hosted evidence. State that npm 0.4.2, npm 0.5.0, npm deprecation, GitHub tags/releases, PR 33 merge, `master` push, and docs deployment remain unperformed pending authorization.

The next protected slice creates `release/0.4.x` from `b268455`, backports only reviewed integrity commits, generates 0.4.2 through Changesets, and collects hosted/provenance evidence before separately authorized publish.
