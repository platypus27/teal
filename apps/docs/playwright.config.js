import { defineConfig, devices } from '@playwright/test'
import { runPort } from './scripts/e2e-ports.mjs'

// Reserve one free loopback port per run (scripts/e2e-ports.mjs, ADR-0012 in
// docs/adr): the first config evaluation publishes it on TEAL_DOCS_E2E_PORT
// and every later evaluation sees the same value, because Playwright
// re-evaluates this config in each worker with the runner's environment and
// the webServer command inherits it. Set TEAL_DOCS_E2E_PORT explicitly to
// pin a port instead.
const port = await runPort('TEAL_DOCS_E2E_PORT')
const origin = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 4,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: origin,
    trace: 'retain-on-failure',
  },
  // Build the teal package first so the bundled CSS always reflects the
  // current package source, then build the docs app on top of it. Never reuse
  // a running server: a reused preview may keep serving CSS from an older
  // build, which silently invalidates the visual and computed-style tests.
  webServer: {
    command: `npm run build --workspace @kryv/teal && npm run build && npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: origin,
    timeout: 180_000,
    reuseExistingServer: false,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], baseURL: origin } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], baseURL: origin } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], baseURL: origin } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'], baseURL: origin } },
  ],
})
