import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

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
