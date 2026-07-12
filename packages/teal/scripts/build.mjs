import { copyFile, mkdir, rm } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { build as viteBuild } from 'vite'

const require = createRequire(import.meta.url)
const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')

function runNode(modulePath, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, [modulePath, ...args], {
      cwd: root,
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
await runNode(require.resolve('tailwindcss/lib/cli.js'), [
  '-c',
  resolve(root, 'tailwind.preset.js'),
  '-i',
  resolve(root, 'src/styles.css'),
  '-o',
  resolve(dist, 'styles.css'),
  '--minify',
])

await mkdir(dist, { recursive: true })
await Promise.all([
  copyFile(resolve(root, 'src/tokens.css'), resolve(dist, 'tokens.css')),
  copyFile(resolve(root, 'src/base.css'), resolve(dist, 'base.css')),
  copyFile(resolve(root, 'tailwind.preset.js'), resolve(dist, 'tailwind.preset.js')),
])
