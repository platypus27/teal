import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { modules } from '../src/data/module-meta.js'

const moduleIds = modules.map((module) => module.id)

test('every documentation module has no accessibility violations', async ({ page }) => {
  test.slow() // Visits all 22 module pages in one test
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
  await expect(page.getByRole('link', { name: 'Getting started' })).toBeFocused()
  await page
    .getByRole('navigation', { name: 'Documentation' })
    .getByRole('link', { name: 'Select', exact: true })
    .click()
  await expect(page.getByRole('heading', { level: 1, name: 'Select' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeVisible()
})

test('command search is keyboard navigable and transfers focus', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Search the docs/ }).first().click()
  const input = page.getByRole('textbox', { name: 'Search the docs' })
  await expect(input).toBeFocused()
  await input.fill('Select')
  await input.press('Enter')
  await expect(page.getByRole('heading', { level: 1, name: 'Select' })).toBeVisible()
})

test('disclosed search uses focus transfer and Escape dismissal', async ({ page }) => {
  await page.goto('/modules/tooltip')
  await page.getByRole('button', { name: 'Open search' }).click()
  const input = page.getByRole('textbox', { name: 'Search' })
  await expect(input).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Open search' })).toBeVisible()
})

test('documentation has no horizontal overflow on a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/modules/field')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('module pages match the approved desktop visual baseline', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || isMobile, 'Stable visual baseline uses desktop Chromium')
  await page.goto('/modules/button')
  await expect(page).toHaveScreenshot('button-module-light.png', { fullPage: true, maxDiffPixels: 300 })
  await page.getByRole('button', { name: 'Dark mode' }).click()
  await expect(page).toHaveScreenshot('button-module-dark.png', { fullPage: true, maxDiffPixels: 300 })
})
