import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { inlineStyles } from '../apps/docs/scripts/inline-styles.mjs'

async function docsFixture(t) {
  const dist = await mkdtemp(join(tmpdir(), 'teal-inline-styles-'))
  const assets = join(dist, 'assets')
  await mkdir(assets)
  const html = '<!doctype html><link rel="stylesheet" href="/assets/main.css"><main>Teal</main>\n'
  await Promise.all([
    writeFile(join(dist, 'index.html'), html),
    writeFile(join(dist, 'module.html'), html),
    writeFile(join(dist, 'recipes.html'), html),
    writeFile(join(assets, 'main.css'), 'body { color: teal; }\n'),
  ])
  t.after(() => rm(dist, { recursive: true, force: true }))
  return { assets, dist }
}

test('inlines one bounded regular stylesheet into every documentation entry', async (t) => {
  const fixture = await docsFixture(t)

  await inlineStyles(fixture.dist)

  for (const name of ['index.html', 'module.html', 'recipes.html']) {
    const html = await readFile(join(fixture.dist, name), 'utf8')
    assert.match(html, /<style data-teal-critical>body \{ color: teal; \}\s*<\/style>/)
    assert.doesNotMatch(html, /rel="stylesheet"/)
  }
})

test('rejects a stylesheet symlink instead of following it', async (t) => {
  const fixture = await docsFixture(t)
  const stylesheet = join(fixture.assets, 'main.css')
  const target = join(fixture.assets, 'target.css')
  await rm(stylesheet)
  await writeFile(target, 'body { color: red; }\n')
  await symlink(target, stylesheet)

  await assert.rejects(inlineStyles(fixture.dist), /ELOOP|symbolic link/i)
})

test('rejects a stylesheet beyond the declared byte bound', async (t) => {
  const fixture = await docsFixture(t)
  await writeFile(join(fixture.assets, 'main.css'), Buffer.alloc(512 * 1024 + 1, 97))

  await assert.rejects(inlineStyles(fixture.dist), /exceeds its bounded size/i)
})
