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
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:5173' } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], baseURL: 'http://127.0.0.1:5173' } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], baseURL: 'http://127.0.0.1:5173' } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'], baseURL: 'http://127.0.0.1:5173' } },
  ],
})
