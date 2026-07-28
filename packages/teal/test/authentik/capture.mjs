// Captures the Authentik reference flow screenshots with the Teal adapter
// applied. Run the fixture (docker compose up), setup.mjs, and setup-flows.mjs
// first. Output: test/authentik/snapshots/<flow>-<theme>-<viewport>.png plus a
// reduced-motion desktop capture per flow.
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'

const base = 'http://127.0.0.1:19000'
const snapshots = resolve(import.meta.dirname, 'snapshots')

const flows = [
  { id: 'login', path: '/if/flow/default-authentication-flow/', session: false },
  { id: 'recovery', path: '/if/flow/fixture-recovery/', session: false },
  { id: 'webauthn', path: '/if/flow/default-authenticator-webauthn-setup/', session: true, webauthn: true },
  {
    id: 'consent',
    path: '/application/o/authorize/?response_type=code&client_id=fixture-photos&redirect_uri=https%3A%2F%2Ffixture-photos.kryvlabs.example%2Fauth%2Fcallback&scope=openid&state=fixture',
    session: true,
  },
  {
    id: 'denial',
    path: '/application/o/authorize/?response_type=code&client_id=fixture-vault&redirect_uri=https%3A%2F%2Ffixture-vault.kryvlabs.example%2Fauth%2Fcallback&scope=openid&state=fixture',
    session: true,
    waitFor: 'text=Permission denied',
  },
]
const themes = ['light', 'dark']
const viewports = [
  { id: 'desktop', width: 1280, height: 900 },
  { id: 'phone', width: 390, height: 844 },
]

async function login(page) {
  const request = page.context().request
  const executor = `${base}/api/v3/flows/executor/default-authentication-flow/`
  const identification = await (await request.get(executor)).json()
  const passwordStage = await (
    await request.post(executor, { data: { component: identification.component, uid_field: 'fixture-owner' } })
  ).json()
  const result = await (
    await request.post(executor, { data: { component: passwordStage.component, password: 'fixture-owner-password' } })
  ).json()
  if (result.type !== 'redirect' && result.component !== 'xak-flow-redirect') {
    throw new Error(`Login did not complete: ${JSON.stringify(result).slice(0, 200)}`)
  }
}

async function capture(browser, flow, theme, viewport, motion) {
  const page = await browser.newPage({ viewport })
  await page.emulateMedia({ colorScheme: theme, reducedMotion: motion })
  if (flow.webauthn) {
    // Hold the browser ceremony open so the stage stays on its interactive
    // waiting surface instead of racing to an error state in headless.
    await page.addInitScript(() => {
      navigator.credentials.create = () => new Promise(() => {})
      navigator.credentials.get = () => new Promise(() => {})
    })
  }
  if (flow.session) await login(page)
  await page.goto(`${base}${flow.path}`)
  await page.locator(flow.waitFor ?? 'ak-flow-executor').waitFor()
  await page.waitForTimeout(1000)
  const suffix = motion === 'reduce' ? 'reduced-motion-desktop' : `${theme}-${viewport.id}`
  await page.screenshot({ path: resolve(snapshots, `${flow.id}-${suffix}.png`), fullPage: true })
  await page.close()
}

await mkdir(snapshots, { recursive: true })
const browser = await chromium.launch()
for (const flow of flows) {
  for (const theme of themes) {
    for (const viewport of viewports) {
      await capture(browser, flow, theme, viewport, 'no-preference')
    }
  }
  await capture(browser, flow, 'light', viewports[0], 'reduce')
}
await browser.close()
console.log(`Captured ${flows.length * (themes.length * viewports.length + 1)} screenshots`)
