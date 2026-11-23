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
  // Two workers, not four: in the pinned image Chromium renders through
  // SwiftShader (no GPU), and four software-rendered pages competing for host
  // CPU push first paint past the expect window. Kryv Home reached the same
  // number for the same reason (see its playwright.config).
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  // Baselines are produced and verified in one pinned environment
  // (apps/docs/scripts/playwright-pinned.sh), so a retry can only mask a real
  // failure. Keep retries disabled; fix flakes at their cause instead.
  retries: 0,
  reporter: 'list',
  expect: {
    // Software rendering in the pinned image boots some pages slower than
    // the default 5s window; 15s keeps routine expects green without retries.
    timeout: 15_000,
  },
  use: {
    baseURL: origin,
    trace: 'retain-on-failure',
    // Date, time, and locale sensitive rendering must not depend on the host:
    // the wrapper pins these for the container, and the context pins them for
    // any direct playwright run.
    timezoneId: 'UTC',
    locale: 'en-US',
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
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
    { name: 'mobile-chromium', use: devices['Pixel 7'] },
  ],
})
