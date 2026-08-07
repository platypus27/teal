import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import {
  assertPackedFiles,
  assertSafeArchivePath,
  sha512Integrity,
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

test('calculates npm-compatible SHA-512 integrity', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'teal-integrity-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const file = join(directory, 'artifact.tgz')
  await writeFile(file, 'teal\n')

  assert.equal(
    await sha512Integrity(file),
    'sha512-Im/nybgYv5YjG+7qWGhR6zCs/8SoHm9i8K9heldzc2Y34Xkah+mpA1miL6hilqLK3jjOBoeUULr82EkBbZCCpw==',
  )
})

test('rejects declared package targets that escape the package', () => {
  assert.throws(
    () => assertPackedFiles({
      packageJson: { ...packageJson, exports: { '.': '../outside.js' } },
      packedFiles: ['package.json', '../outside.js'],
      builtDistFiles: [],
    }),
    /declared package target escapes/i,
  )
})
