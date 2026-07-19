import { access, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { createServer } from 'node:http'
import { promisify } from 'node:util'
import { resolve } from 'node:path'
import { chromium } from 'playwright'

const exec = promisify(execFile)
const root = resolve(import.meta.dirname, '..')
const workspaceRoot = resolve(root, '../..')
const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))

async function run(command, args, cwd = workspaceRoot) {
  const { stdout, stderr } = await exec(command, args, { cwd, env: process.env, maxBuffer: 10 * 1024 * 1024 })
  if (stdout) process.stdout.write(stdout)
  if (stderr) process.stderr.write(stderr)
}

async function verifyCompiledConsumer(consumer) {
  const directory = resolve(consumer, 'dist')
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname
    const file = resolve(directory, pathname === '/' ? 'index.html' : `.${pathname}`)
    if (!file.startsWith(directory)) {
      response.writeHead(403).end()
      return
    }
    try {
      const body = await readFile(file)
      const contentType = file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : 'text/html'
      response.writeHead(200, { 'content-type': contentType }).end(body)
    } catch {
      response.writeHead(404).end()
    }
  })

  let browser
  try {
    await new Promise((resolveListening) => server.listen(0, '127.0.0.1', resolveListening))
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Packed consumer server did not expose a port')

    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(`http://127.0.0.1:${address.port}`)
    const styles = await page.evaluate(() => {
      const computed = (id) => getComputedStyle(document.getElementById(id))
      const root = getComputedStyle(document.documentElement)
      return {
        alert: { borderStyle: computed('consumer-alert').borderStyle, borderWidth: computed('consumer-alert').borderWidth },
        avatarSize: { height: computed('consumer-avatar').height, width: computed('consumer-avatar').width },
        badgeHeight: computed('consumer-badge').height,
        buttonHeight: computed('consumer-button').height,
        card: {
          borderRadius: computed('consumer-card').borderRadius,
          borderStyle: computed('consumer-card').borderStyle,
          borderWidth: computed('consumer-card').borderWidth,
        },
        controlRadius: root.getPropertyValue('--teal-radius-control').trim(),
        inputBackground: computed('consumer-input').backgroundColor,
        tabsHeight: getComputedStyle(document.querySelector('[role="tablist"]')).height,
      }
    })
    if (styles.alert.borderStyle !== 'solid' || styles.alert.borderWidth !== '1px') {
      throw new Error(`Compiled Alert border is not visible: ${JSON.stringify(styles.alert)}`)
    }
    if (styles.card.borderStyle !== 'solid' || styles.card.borderWidth !== '1px' || styles.card.borderRadius !== '20px') {
      throw new Error(`Compiled Card surface is incorrect: ${JSON.stringify(styles.card)}`)
    }
    if (styles.buttonHeight !== '40px') throw new Error(`Compiled Button height changed: ${styles.buttonHeight}`)
    if (styles.avatarSize.height !== '40px' || styles.avatarSize.width !== '40px') {
      throw new Error(`Compiled Avatar dimensions changed: ${JSON.stringify(styles.avatarSize)}`)
    }
    if (styles.badgeHeight !== '20px') throw new Error(`Compiled Badge height changed: ${styles.badgeHeight}`)
    if (styles.tabsHeight !== '44px') throw new Error(`Compiled Tabs height changed: ${styles.tabsHeight}`)
    if (styles.inputBackground === 'rgba(0, 0, 0, 0)') throw new Error('Compiled Input background is transparent')
    if (styles.controlRadius !== '1rem') throw new Error(`Compiled token value is incorrect: ${styles.controlRadius}`)
  } finally {
    await browser?.close()
    if (server.listening) {
      await new Promise((resolveClosed, reject) => server.close((error) => error ? reject(error) : resolveClosed()))
    }
  }
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
    await writeFile(resolve(consumer, 'main.js'), `import React from 'react'
import { createRoot } from 'react-dom/client'
import { Alert, Avatar, Badge, Button, Card, Field, Input, Tabs } from '@kryv/teal'
import '@kryv/teal/styles.css'

const app = React.createElement(
  Card,
  { id: 'consumer-card' },
  React.createElement(Alert, { id: 'consumer-alert', title: 'Package verified', variant: 'success' }, 'Compiled styles loaded'),
  React.createElement(Avatar, { id: 'consumer-avatar', name: 'Avery Chen' }),
  React.createElement(Badge, { id: 'consumer-badge' }, 'Ready'),
  React.createElement(Field, { label: 'Workspace' }, React.createElement(Input, { id: 'consumer-input', defaultValue: 'Northstar' })),
  React.createElement(Tabs, { 'aria-label': 'Consumer tabs', defaultValue: 'overview', items: [{ value: 'overview', label: 'Overview', content: 'Overview' }] }),
  React.createElement(Button, { id: 'consumer-button', variant: 'secondary' }, 'Continue'),
)
createRoot(document.getElementById('root')).render(app)
`)
    await writeFile(resolve(consumer, 'ssr.mjs'), "import React from 'react'; import { renderToString } from 'react-dom/server'; import { Button } from '@kryv/teal'; if (!renderToString(React.createElement(Button, null, 'SSR'))) process.exit(1)")
    await run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumer)
    await run(process.execPath, ['-e', "import('@kryv/teal').then((mod) => { if (!mod.Button || !mod.VerticalNavItem) throw new Error('public export missing') })"], consumer)
    await run(process.execPath, ['ssr.mjs'], consumer)
    await run('npm', ['exec', '--', 'vite', 'build'], consumer)
    const builtAssets = resolve(consumer, 'dist/assets')
    const builtCssFiles = (await readdir(builtAssets)).filter((file) => file.endsWith('.css'))
    if (builtCssFiles.length !== 1) throw new Error(`Expected one compiled consumer stylesheet, found ${builtCssFiles.length}`)
    const builtCss = await readFile(resolve(builtAssets, builtCssFiles[0]), 'utf8')
    for (const expected of ['--teal-radius-control', '.teal-focus-ring', '.bg-primary']) {
      if (!builtCss.includes(expected)) throw new Error(`Packed consumer stylesheet is missing ${expected}`)
    }
    await verifyCompiledConsumer(consumer)
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
