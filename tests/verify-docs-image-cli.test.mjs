import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import test from 'node:test'

const exec = promisify(execFile)
const root = new URL('../', import.meta.url)

test('docs image verifier rejects a relative runner temporary root before Docker', async () => {
  await assert.rejects(
    exec(process.execPath, [
      'scripts/verify-docs-image.mjs',
      '--image', 'teal-docs:test',
      '--revision', 'a'.repeat(40),
      '--source', 'https://github.com/platypus27/teal',
      '--temporary-root', 'runner-temp',
    ], { cwd: root }),
    (error) => {
      assert.match(error.stderr, /Temporary root must be an absolute existing directory/)
      assert.doesNotMatch(error.stderr, /docker/i)
      return true
    },
  )
})
