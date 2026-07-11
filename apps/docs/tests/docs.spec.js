import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const moduleIds = [
  'button', 'field', 'input', 'select', 'checkbox', 'switch', 'card', 'badge',
  'dialog', 'tooltip', 'menu', 'popover', 'toast', 'empty-state', 'loading',
  'tabs', 'pagination', 'page-header', 'table', 'separator',
]

test('every documentation module has no accessibility violations', async ({ page }) => {
  test.slow() // Visits all 20 module pages in one test
  for (const moduleId of moduleIds) {
    await page.goto(`/modules/${moduleId}`)

    if (moduleId === 'dialog') await page.locator('#examples').getByRole('button', { name: 'Open dialog' }).click()
    if (moduleId === 'tooltip') await page.getByRole('button', { name: 'Open search' }).hover()
    if (moduleId === 'menu') await page.getByRole('button', { name: 'Project actions' }).click()
    if (moduleId === 'popover') await page.getByRole('button', { name: 'Filters' }).click()
    if (moduleId === 'toast') await page.getByRole('button', { name: 'Show toast' }).click()

    await page.waitForTimeout(250)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations, `Accessibility violations on ${moduleId}`).toEqual([])
  }
})

test('mobile navigation reaches a module', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile navigation behavior')
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page
    .getByRole('navigation', { name: 'Documentation' })
    .getByRole('link', { name: 'Select', exact: true })
    .click()
  await expect(page.getByRole('heading', { level: 1, name: 'Select' })).toBeVisible()
})

test('module pages match the approved desktop visual baseline', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || isMobile, 'Stable visual baseline uses desktop Chromium')
  await page.goto('/modules/button')
  await expect(page).toHaveScreenshot('button-module-light.png', { fullPage: true })
  await page.getByRole('button', { name: 'Dark mode' }).click()
  await expect(page).toHaveScreenshot('button-module-dark.png', { fullPage: true })
})
