// The visual gates must run in one pinned environment. These tests pin the
// pin itself (digest form, version agreement with the lockfile), the wrapper's
// docker invocation (with a fake docker), and that the CI browser job goes
// through the wrapper instead of installing browsers on the runner.

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..')
const SCRIPT_DIR = 'apps/docs/scripts'
const read = (p) => readFileSync(join(ROOT, p), 'utf8')
const pin = Object.fromEntries(
  read(`${SCRIPT_DIR}/playwright-image.env`).split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => l.split('=')),
)

test('the pinned image is addressed by digest', () => {
  assert.match(pin.PLAYWRIGHT_IMAGE, /^mcr\.microsoft\.com\/playwright@sha256:[0-9a-f]{64}$/)
})

test('the pinned Playwright version is the locked @playwright/test version', () => {
  const packages = JSON.parse(read('package-lock.json')).packages
  const lock = packages['node_modules/@playwright/test'] ?? packages['apps/docs/node_modules/@playwright/test']
  assert.ok(lock, 'lockfile holds @playwright/test at the root or the docs workspace')
  assert.equal(pin.PLAYWRIGHT_VERSION, lock.version)
})

// A scratch repository root with the wrapper, the pin and a fake installed
// Playwright, and a fake docker that records its argv. `where` places the
// fake package.json either at the workspace root (hoisted layout) or in the
// docs workspace (npm 12 single-consumer layout).
function scratch(installedVersion = pin.PLAYWRIGHT_VERSION, where = '') {
  const root = mkdtempSync(join(tmpdir(), 'pw-pinned-'))
  mkdirSync(join(root, SCRIPT_DIR), { recursive: true })
  for (const f of ['playwright-pinned.sh', 'playwright-image.env']) cpSync(join(ROOT, SCRIPT_DIR, f), join(root, SCRIPT_DIR, f))
  mkdirSync(join(root, where, 'node_modules/@playwright/test'), { recursive: true })
  writeFileSync(join(root, where, 'node_modules/@playwright/test/package.json'), `{\n  "name": "@playwright/test",\n  "version": "${installedVersion}",\n  "x": 1\n}\n`)
  const bin = join(root, 'bin')
  mkdirSync(bin)
  writeFileSync(join(bin, 'docker'), '#!/usr/bin/env bash\nprintf "%s\\n" "$@" > "$DOCKER_ARGV"\n')
  chmodSync(join(bin, 'docker'), 0o755)
  const argv = join(root, 'argv.txt')
  const run = (args, env = {}) => {
    const r = spawnSync(join(root, SCRIPT_DIR, 'playwright-pinned.sh'), args, {
      cwd: root, encoding: 'utf8',
      env: { PATH: `${bin}:${process.env.PATH}`, DOCKER_ARGV: argv, ...env },
    })
    let docker = []
    try { docker = readFileSync(argv, 'utf8').trim().split('\n') } catch { /* docker not reached */ }
    return { ...r, docker }
  }
  return { root, run }
}

test('the wrapper runs the command in the pinned image, as the caller, at the same path, with pinned locale and timezone', () => {
  const { root, run } = scratch()
  const r = run(['-e', 'KRYV_TEAL_DOCS_EXTRA', '--', 'npm', 'run', 'test:e2e'])
  assert.equal(r.status, 0, r.stderr)
  const a = r.docker
  assert.deepEqual(a.slice(0, 2), ['run', '--rm'])
  assert.ok(a.includes('--network') && a[a.indexOf('--network') + 1] === 'host')
  assert.ok(a.includes('--ipc=host'))
  assert.equal(a[a.indexOf('--user') + 1], `${process.getuid()}:${process.getgid()}`)
  assert.equal(a[a.indexOf('-v') + 1], `${root}:${root}`)
  assert.equal(a[a.indexOf('-w') + 1], root)
  assert.ok(a.includes('KRYV_TEAL_DOCS_EXTRA'))
  for (const pinned of ['TZ=UTC', 'LANG=C.UTF-8', 'LC_ALL=C.UTF-8']) assert.ok(a.includes(pinned), a.join(' '))
  const image = a.indexOf(pin.PLAYWRIGHT_IMAGE)
  assert.ok(image > 0, 'the image is passed by digest')
  assert.deepEqual(a.slice(image + 1), ['npm', 'run', 'test:e2e'])
})

test('the wrapper also finds a workspace-local @playwright/test (npm 12 layout)', () => {
  const { run } = scratch(pin.PLAYWRIGHT_VERSION, 'apps/docs')
  const r = run(['--', 'node', '-v'])
  assert.equal(r.status, 0, r.stderr)
  assert.notDeepEqual(r.docker, [], 'docker ran')
})

test('the wrapper reports missing dependencies instead of crashing', () => {
  const root = mkdtempSync(join(tmpdir(), 'pw-pinned-'))
  mkdirSync(join(root, SCRIPT_DIR), { recursive: true })
  for (const f of ['playwright-pinned.sh', 'playwright-image.env']) cpSync(join(ROOT, SCRIPT_DIR, f), join(root, SCRIPT_DIR, f))
  const r = spawnSync(join(root, SCRIPT_DIR, 'playwright-pinned.sh'), ['--', 'true'], { cwd: root, encoding: 'utf8' })
  assert.equal(r.status, 1)
  assert.match(r.stderr, /run npm ci first/)
})

test('on GitHub Actions the runner Node (the repository engines version) is mounted read-only', () => {
  const { run } = scratch()
  const r = run(['--', 'node', '-v'], { GITHUB_ACTIONS: 'true' })
  assert.equal(r.status, 0, r.stderr)
  assert.ok(r.docker.some((x) => /^\/.*:\/.*:ro$/.test(x)), r.docker.join(' '))
  assert.ok(r.docker.some((x) => x.startsWith('PATH=') && x.includes('/bin:')))
})

test('the wrapper refuses an installed Playwright that differs from the pinned image', () => {
  const { run } = scratch('1.0.0')
  const r = run(['--', 'true'])
  assert.notEqual(r.status, 0)
  assert.match(r.stderr, new RegExp(`pinned image is Playwright ${pin.PLAYWRIGHT_VERSION.replaceAll('.', '\\.')}`))
  assert.deepEqual(r.docker, [], 'docker must not run')
})

test('the wrapper needs a command and installed dependencies', () => {
  assert.equal(scratch().run([]).status, 2)
  assert.equal(scratch().run(['--']).status, 2)
})

// --- CI ---------------------------------------------------------------------

function job(workflow, id) {
  const m = workflow.match(new RegExp(`(?:^|\\n)  ${id}:\\n([\\s\\S]*?)(?=\\n  [a-z0-9_-]+:\\n|$)`))
  assert.ok(m, `job ${id} exists`)
  return m[1]
}

test('the CI browser job runs its gate in the pinned image and installs no browsers on the runner', () => {
  const ci = read('.github/workflows/pipeline.yml')
  const body = job(ci, 'browser')
  assert.match(body, /apps\/docs\/scripts\/playwright-pinned\.sh .*-- npm run test:e2e --workspace @kryv\/teal-docs/)
  assert.doesNotMatch(body, /playwright install/, 'the browser job must not use the runner\'s own browser')
  assert.match(body, /chromium/, 'the matrix keeps the chromium baseline project')
  assert.match(body, /mobile-chromium/, 'the matrix keeps the mobile-chromium baseline project')
  // The only runner-side browser install is the quality job's chromium for
  // verify:package, the packed-tarball smoke test; it is not a screenshot gate.
  assert.doesNotMatch(ci.replace(job(ci, 'quality'), ''), /playwright install/)
  assert.match(job(ci, 'quality'), /npx playwright install --with-deps chromium/)
})

test('checked-in screenshot baselines exist for the pinned projects', () => {
  const ls = spawnSync('git', ['ls-files', 'apps/docs/tests/docs.spec.js-snapshots'], { cwd: ROOT, encoding: 'utf8' })
  const files = ls.stdout.trim().split('\n').filter(Boolean)
  assert.ok(files.length >= 10, files.join(','))
  for (const f of files) assert.match(f, /-(chromium|mobile-chromium)-linux\.png$/, `${f} was not produced on linux chromium`)
})
