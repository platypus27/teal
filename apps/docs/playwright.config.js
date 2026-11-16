import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 4,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  // Build the teal package first so the bundled CSS always reflects the
  // current package source, then build the docs app on top of it. Never reuse
  // a running server: a reused preview may keep serving CSS from an older
  // build, which silently invalidates the visual and computed-style tests.
  webServer: {
    command: 'npm run build --workspace @kryv/teal && npm run build && npm run preview -- --host 127.0.0.1 --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173',
    timeout: 180_000,
    reuseExistingServer: false,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:5173' } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], baseURL: 'http://127.0.0.1:5173' } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], baseURL: 'http://127.0.0.1:5173' } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'], baseURL: 'http://127.0.0.1:5173' } },
  ],
})
