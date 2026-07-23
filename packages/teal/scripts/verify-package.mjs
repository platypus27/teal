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
    await page.emulateMedia({ reducedMotion: 'no-preference' })
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
        genericBackground: computed('generic-primary').backgroundColor,
        overrideBackgrounds: ['hex', 'rgb', 'hsl', 'oklch', 'var'].map((format) =>
          computed(`override-${format}`).backgroundColor
        ),
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
    if (styles.genericBackground !== 'rgb(255, 0, 255)') {
      throw new Error(`Application utility did not retain its own primary color: ${styles.genericBackground}`)
    }
    if (styles.overrideBackgrounds.some((color) => color === 'rgba(0, 0, 0, 0)')) {
      throw new Error(`A complete CSS color override was rejected: ${JSON.stringify(styles.overrideBackgrounds)}`)
    }
    if (new Set(styles.overrideBackgrounds).size !== styles.overrideBackgrounds.length) {
      throw new Error(`Complete CSS color formats did not produce distinct colors: ${JSON.stringify(styles.overrideBackgrounds)}`)
    }

    await page.locator('#consumer-button').focus()
    const focusStyle = await page.locator('#consumer-button').evaluate((element) => {
      const style = getComputedStyle(element)
      return { boxShadow: style.boxShadow, outlineWidth: style.outlineWidth }
    })
    if (focusStyle.boxShadow === 'none' || focusStyle.outlineWidth !== '2px') {
      throw new Error(`Keyboard focus indicator is missing: ${JSON.stringify(focusStyle)}`)
    }

    const activeState = await page.locator('#consumer-button').evaluate((element) => {
      const className = element.getAttribute('class') ?? ''
      const packagedRules = Array.from(document.styleSheets)
        .flatMap((sheet) => Array.from(sheet.cssRules))
      return {
        hasClass: className.includes('active:teal-u-scale-[0.98]'),
        hasRule: packagedRules.some(
          (rule) =>
            rule.selectorText?.includes('.active\\:teal-u-scale-\\[0\\.98\\]:active') &&
            Number.parseFloat(rule.style?.getPropertyValue('--tw-scale-x')) === 0.98,
        ),
      }
    })
    if (!activeState.hasClass || !activeState.hasRule) {
      throw new Error(`Packed consumer button lost its active transform wiring: ${JSON.stringify(activeState)}`)
    }

    const invalidInput = page.locator('#consumer-input')
    await invalidInput.evaluate((element) => element.setAttribute('aria-invalid', 'true'))
    await invalidInput.focus()
    if (await invalidInput.evaluate((element) => getComputedStyle(element).boxShadow === 'none')) {
      throw new Error('Invalid focused input lost its focus indicator')
    }

    const requiredForm = page.locator('#required-form')
    if (await requiredForm.evaluate((form) => form.checkValidity())) {
      throw new Error('Required Select did not make its form invalid')
    }
    await page.getByRole('combobox', { name: 'Role' }).click()
    await page.getByRole('option', { name: 'Admin' }).click()
    if (!(await requiredForm.evaluate((form) => form.checkValidity()))) {
      throw new Error('Required Select did not become valid after selection')
    }

    await page.locator('#disabled-card').click({ force: true })
    if ((await page.evaluate(() => window.__tealHarness.cardClicks())) !== 0) {
      throw new Error('Disabled link Card dispatched its click handler')
    }
    if (await page.locator('#disabled-card').getAttribute('tabindex') !== '-1') {
      throw new Error('Disabled link Card remained in sequential focus order')
    }

    await page.evaluate(() => window.__tealHarness.retryAvatar())
    await page.locator('#retry-avatar img').waitFor()

    if (await page.locator('.dynamic-table').getAttribute('tabindex') !== null) {
      throw new Error('Non-overflowing Table was initially focusable')
    }
    await page.evaluate(() => window.__tealHarness.expandTable())
    await page.waitForFunction(() => document.querySelector('.dynamic-table')?.getAttribute('tabindex') === '0')

    await page.emulateMedia({ forcedColors: 'active' })
    await page.locator('#consumer-button').focus()
    const forcedFocus = await page.locator('#consumer-button').evaluate((element) => {
      const style = getComputedStyle(element)
      return { boxShadow: style.boxShadow, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth }
    })
    if (forcedFocus.boxShadow !== 'none' || forcedFocus.outlineStyle === 'none' || forcedFocus.outlineWidth !== '2px') {
      throw new Error(`Forced-colors focus indicator is missing: ${JSON.stringify(forcedFocus)}`)
    }
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
      devDependencies: { tailwindcss: '^3.4.19', vite: '^8.1.4' },
    }, null, 2))
    await writeFile(resolve(consumer, 'index.html'), '<div id="root"></div><script type="module" src="/main.js"></script>')
    await writeFile(resolve(consumer, 'main.js'), `import React from 'react'
import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import { Alert, Avatar, Badge, Button, Card, Field, Input, Select, Table, Tabs } from '@kryv/teal'
import '@kryv/teal/styles.css'
import './app.css'

function Harness() {
  const [avatarSrc, setAvatarSrc] = useState('/missing-avatar.png')
  const [tableText, setTableText] = useState('Short')
  const [cardClicks, setCardClicks] = useState(0)
  useEffect(() => {
    window.__tealHarness = {
      cardClicks: () => cardClicks,
      expandTable: () => setTableText('W'.repeat(600)),
      retryAvatar: () => setAvatarSrc('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"></svg>'),
    }
  }, [cardClicks])

  const override = (format, color) =>
    React.createElement(Button, { id: \`override-\${format}\`, style: { '--teal-color-primary': color } }, format)

  return React.createElement(
    Card,
    { id: 'consumer-card' },
    React.createElement('div', { id: 'generic-primary', className: 'bg-primary' }, 'Application primary'),
    React.createElement(Alert, { id: 'consumer-alert', title: 'Package verified', variant: 'success' }, 'Compiled styles loaded'),
    React.createElement(Avatar, { id: 'consumer-avatar', name: 'Avery Chen' }),
    React.createElement(Avatar, { id: 'retry-avatar', name: 'Ada Lovelace', src: avatarSrc }),
    React.createElement(Badge, { id: 'consumer-badge' }, 'Ready'),
    React.createElement(Field, { label: 'Workspace' }, React.createElement(Input, { id: 'consumer-input', defaultValue: 'Northstar' })),
    React.createElement('form', { id: 'required-form' },
      React.createElement(Field, { label: 'Role', required: true },
        React.createElement(Select, {
          name: 'role',
          required: true,
          options: [{ label: 'Admin', value: 'admin' }],
        }),
      ),
    ),
    React.createElement(Tabs, { 'aria-label': 'Consumer tabs', defaultValue: 'overview', items: [{ value: 'overview', label: 'Overview', content: 'Overview' }] }),
    React.createElement(Button, { id: 'consumer-button', variant: 'secondary' }, 'Continue'),
    override('hex', '#7c3aed'),
    override('rgb', 'rgb(20 100 200)'),
    override('hsl', 'hsl(140 60% 40%)'),
    override('oklch', 'oklch(60% 0.2 250)'),
    React.createElement(Button, {
      id: 'override-var',
      style: { '--consumer-primary': '#c026d3', '--teal-color-primary': 'var(--consumer-primary)' },
    }, 'var'),
    React.createElement(Card, {
      as: 'a',
      disabled: true,
      href: '/should-not-navigate',
      id: 'disabled-card',
      onClick: () => setCardClicks((value) => value + 1),
    }, 'Disabled card'),
    React.createElement(Table, {
      caption: 'Dynamic',
      columns: [{ key: 'value', header: 'Value', cell: (row) => row.value }],
      getRowKey: () => 'row',
      rows: [{ value: tableText }],
      className: 'dynamic-table',
    }),
  )
}
createRoot(document.getElementById('root')).render(React.createElement(Harness))
`)
    await writeFile(resolve(consumer, 'app.css'), '.bg-primary { background-color: rgb(255 0 255); }')
    await writeFile(resolve(consumer, 'tailwind-input.css'), '@tailwind utilities;')
    await writeFile(resolve(consumer, 'tailwind-content.html'), '<div class="bg-primary bg-teal-primary text-teal-on-primary"></div>')
    await writeFile(resolve(consumer, 'tailwind.config.js'), `import tealPreset from '@kryv/teal/tailwind-preset'
export default {
  presets: [tealPreset],
  content: ['./tailwind-content.html'],
  theme: { extend: { colors: { primary: '#ff00ff' } } },
}
`)
    await writeFile(resolve(consumer, 'ssr.mjs'), "import React from 'react'; import { renderToString } from 'react-dom/server'; import { Button } from '@kryv/teal'; if (!renderToString(React.createElement(Button, null, 'SSR'))) process.exit(1)")
    await run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumer)
    await run(process.execPath, ['-e', "import('@kryv/teal').then((mod) => { if (!mod.Button || !mod.VerticalNavItem) throw new Error('public export missing') })"], consumer)
    await run(process.execPath, ['ssr.mjs'], consumer)
    await run('npm', ['exec', '--', 'tailwindcss', '-c', 'tailwind.config.js', '-i', 'tailwind-input.css', '-o', 'public-utilities.css', '--minify'], consumer)
    const publicUtilities = await readFile(resolve(consumer, 'public-utilities.css'), 'utf8')
    for (const expected of ['.bg-primary', '.bg-teal-primary', '.text-teal-on-primary']) {
      if (!publicUtilities.includes(expected)) throw new Error(`Public preset stylesheet is missing ${expected}`)
    }
    await run('npm', ['exec', '--', 'vite', 'build'], consumer)
    const builtAssets = resolve(consumer, 'dist/assets')
    const builtCssFiles = (await readdir(builtAssets)).filter((file) => file.endsWith('.css'))
    if (builtCssFiles.length !== 1) throw new Error(`Expected one compiled consumer stylesheet, found ${builtCssFiles.length}`)
    const builtCss = await readFile(resolve(builtAssets, builtCssFiles[0]), 'utf8')
    for (const expected of ['--teal-radius-control', '--teal-color-primary', '.teal-focus-ring', '.teal-u-bg-primary']) {
      if (!builtCss.includes(expected)) throw new Error(`Packed consumer stylesheet is missing ${expected}`)
    }
    if (builtCss.includes('.bg-primary{--tw-bg-opacity')) {
      throw new Error('Packed component CSS leaked the legacy unnamespaced primary utility')
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
