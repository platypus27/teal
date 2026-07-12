import { access, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { resolve } from 'node:path'

const exec = promisify(execFile)
const root = resolve(import.meta.dirname, '..')
const workspaceRoot = resolve(root, '../..')
const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))

async function run(command, args, cwd = workspaceRoot) {
  const { stdout, stderr } = await exec(command, args, { cwd, env: process.env, maxBuffer: 10 * 1024 * 1024 })
  if (stdout) process.stdout.write(stdout)
  if (stderr) process.stderr.write(stderr)
}

await run(process.execPath, [resolve(root, 'scripts/build.mjs')], root)
const packDir = '/tmp/teal-package-check'
await rm(packDir, { recursive: true, force: true })
await mkdir(packDir, { recursive: true })
const { stdout: packOutput } = await exec('npm', ['pack', '--json', '--workspace', packageJson.name, '--pack-destination', packDir], {
  cwd: workspaceRoot,
  env: process.env,
})
const tarball = JSON.parse(packOutput)[0]?.filename
if (!tarball) throw new Error('npm pack did not produce a tarball name')

const tarballPath = resolve(packDir, tarball)
await exec('npm', ['exec', '--workspace', packageJson.name, '--', 'publint', 'run', '--strict', tarballPath], {
  cwd: workspaceRoot,
  env: process.env,
})

const declarationMaps = (await readdir(resolve(root, 'dist'))).filter((file) => file.endsWith('.d.ts.map'))
for (const file of declarationMaps) {
  const map = JSON.parse(await readFile(resolve(root, 'dist', file), 'utf8'))
  for (const source of map.sources ?? []) await access(resolve(root, 'dist', source))
}

const temp = await mkdtemp('/tmp/teal-consumer-')
try {
  for (const reactVersion of ['18', '19']) {
    const consumer = resolve(temp, `react-${reactVersion}`)
    await mkdir(consumer, { recursive: true })
    await writeFile(resolve(consumer, 'package.json'), JSON.stringify({
      name: `teal-package-consumer-react-${reactVersion}`,
      private: true,
      type: 'module',
      dependencies: {
        '@kryv/teal': `file:${tarballPath}`,
        react: `^${reactVersion}.0.0`,
        'react-dom': `^${reactVersion}.0.0`,
      },
      devDependencies: { vite: '^8.1.4' },
    }, null, 2))
    await writeFile(resolve(consumer, 'index.html'), '<div id="root"></div><script type="module" src="/main.js"></script>')
    await writeFile(resolve(consumer, 'main.js'), "import React from 'react'; import { createRoot } from 'react-dom/client'; import { Button } from '@kryv/teal'; import '@kryv/teal/styles.css'; createRoot(document.getElementById('root')).render(React.createElement(Button, null, 'Verified'))")
    await writeFile(resolve(consumer, 'ssr.mjs'), "import React from 'react'; import { renderToString } from 'react-dom/server'; import { Button } from '@kryv/teal'; if (!renderToString(React.createElement(Button, null, 'SSR'))) process.exit(1)")
    await run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumer)
    await run(process.execPath, ['-e', "import('@kryv/teal').then((mod) => { if (!mod.Button || !mod.VerticalNavItem) throw new Error('public export missing') })"], consumer)
    await run(process.execPath, ['ssr.mjs'], consumer)
    await run('npm', ['exec', '--', 'vite', 'build'], consumer)
    await run(process.execPath, ['-e', "Promise.all([import('@kryv/teal/tailwind-preset'), import('@kryv/teal/styles.css', { with: { type: 'css' } }).catch(() => undefined)])"], consumer)
    const installedPackage = resolve(consumer, 'node_modules/@kryv/teal')
    await access(resolve(installedPackage, 'src/Button.tsx'))
    await access(resolve(installedPackage, 'dist/styles.css'))
    await access(resolve(installedPackage, 'dist/base.css'))
    await access(resolve(installedPackage, 'dist/tokens.css'))
    await access(resolve(installedPackage, 'dist/tailwind.preset.js'))
    for (const file of await readdir(resolve(installedPackage, 'dist'))) {
      if (!file.endsWith('.d.ts.map')) continue
      const map = JSON.parse(await readFile(resolve(installedPackage, 'dist', file), 'utf8'))
      for (const source of map.sources ?? []) await access(resolve(installedPackage, 'dist', source))
    }
  }
} finally {
  await rm(temp, { recursive: true, force: true })
  await rm(tarballPath, { force: true })
  await rm(packDir, { recursive: true, force: true })
}

console.log(`Verified ${packageJson.name}@${packageJson.version}`)
