import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { build as viteBuild } from 'vite'
import { extractCandidates, candidatesDocument } from './extract-candidates.mjs'
import { postProcessStyles } from './prefix-utilities.mjs'

const require = createRequire(import.meta.url)
const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')

function runNode(modulePath, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, [modulePath, ...args], {
      cwd: options.cwd ?? root,
      stdio: 'inherit',
      shell: false,
    })
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (code === 0) resolvePromise()
      else reject(new Error(`${modulePath} exited with ${code ?? signal}`))
    })
  })
}

await rm(dist, { recursive: true, force: true })
await viteBuild({ configFile: resolve(root, 'vite.config.ts') })
await runNode(require.resolve('typescript/bin/tsc'), ['-p', resolve(root, 'tsconfig.build.json')])

// Compile utilities with Tailwind v4 (see src/tw-theme.css for why the
// internal build migrated while the exported preset stays v3-shaped). The
// entry assembles the generated theme, the design tokens, v3-equivalent
// variant behavior, the utility layer, and the extracted class candidates;
// scripts/prefix-utilities.mjs then restores the exact teal-u-* selector
// vocabulary the v3 build shipped.
const buildDir = resolve(root, '.build')
await rm(buildDir, { recursive: true, force: true })
await mkdir(buildDir, { recursive: true })
const candidates = await extractCandidates(resolve(root, 'src'))
await writeFile(resolve(buildDir, 'candidates.html'), candidatesDocument(candidates.candidates))
const twTheme = await readFile(resolve(root, 'src/tw-theme.css'), 'utf8')
const stylesCss = await readFile(resolve(root, 'src/styles.css'), 'utf8')
const entry = `${twTheme}
@import "../src/tokens.css";

/* v3 hover semantics: v4 gates hover behind (hover: hover), which changes
   touch behavior for every consumer of the compiled stylesheet. The gate is
   removed in scripts/prefix-utilities.mjs. Group variants keep v4's
   defaults so named groups (group/item) keep working. */
@custom-variant hover (&:hover);

@import "tailwindcss";
@source "./candidates.html";

${stylesCss}
`
await writeFile(resolve(buildDir, 'entry.css'), entry)

const cliPackagePath = require.resolve('@tailwindcss/cli/package.json')
const { default: cliPackage } = await import(cliPackagePath, { with: { type: 'json' } })
const cliBin = typeof cliPackage.bin === 'string' ? cliPackage.bin : cliPackage.bin.tailwindcss
await runNode(resolve(cliPackagePath, '..', cliBin), [
  '-i',
  'entry.css',
  '-o',
  'styles.raw.css',
  '--minify',
], { cwd: buildDir })

const compiled = await readFile(resolve(buildDir, 'styles.raw.css'), 'utf8')
await writeFile(resolve(dist, 'styles.css'), postProcessStyles(compiled, { spellings: candidates.spellings }))

await mkdir(dist, { recursive: true })
await Promise.all([
  copyFile(resolve(root, 'src/tokens.css'), resolve(dist, 'tokens.css')),
  copyFile(resolve(root, 'src/base.css'), resolve(dist, 'base.css')),
  copyFile(resolve(root, 'tailwind.preset.js'), resolve(dist, 'tailwind.preset.js')),
])
