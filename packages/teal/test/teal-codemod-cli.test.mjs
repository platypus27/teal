import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach } from 'vitest'

const cli = join(dirname(fileURLToPath(import.meta.url)), '../../teal-codemod/cli.mjs')
const legacySource = "import { PulseDot } from '@kryv/teal'\nexport const A = () => <PulseDot />\n"

let workdir
beforeEach(() => {
  workdir = mkdtempSync(join(tmpdir(), 'teal-codemod-cli-'))
})
afterEach(() => {
  rmSync(workdir, { recursive: true, force: true })
})

function run(entry, args) {
  return spawnSync(process.execPath, [entry, ...args], { cwd: workdir, encoding: 'utf8' })
}

describe('teal-codemod cli', () => {
  it('starts with a node shebang so npm bin links can execute it', () => {
    expect(readFileSync(cli, 'utf8').split('\n')[0]).toBe('#!/usr/bin/env node')
  })

  it('runs when started through a symlink, as npm bin links do', () => {
    const link = join(workdir, 'teal-codemod')
    symlinkSync(cli, link)
    const result = run(link, [])
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Usage: teal-codemod <file-or-directory>...')
  })

  it('rewrites sources but skips dependency, VCS and build directories', () => {
    for (const dir of ['src', 'node_modules/pkg', '.git', 'dist', 'build']) {
      mkdirSync(join(workdir, dir), { recursive: true })
      writeFileSync(join(workdir, dir, 'a.tsx'), legacySource)
    }
    const result = run(cli, ['.'])
    expect(result.status, result.stderr).toBe(0)
    expect(result.stdout).toContain('rewrote 1 of 1 file(s)')
    expect(readFileSync(join(workdir, 'src/a.tsx'), 'utf8')).toContain('<StatusDot pulse />')
    for (const dir of ['node_modules/pkg', '.git', 'dist', 'build']) {
      expect(readFileSync(join(workdir, dir, 'a.tsx'), 'utf8'), dir).toBe(legacySource)
    }
  })

  it('still rewrites a file inside a skipped directory when it is named explicitly', () => {
    mkdirSync(join(workdir, 'dist'))
    writeFileSync(join(workdir, 'dist/a.tsx'), legacySource)
    const result = run(cli, ['dist'])
    expect(result.status, result.stderr).toBe(0)
    expect(readFileSync(join(workdir, 'dist/a.tsx'), 'utf8')).toContain('<StatusDot pulse />')
  })
})
