import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { modules } from '../src/data/module-meta.js'

const moduleIds = modules.map((module) => module.id)
const moduleNames = new Map(modules.map((module) => [module.id, module.name]))

async function waitForVisualReady(page, headingName, contentSelector = undefined) {
  await expect(page.getByRole('heading', { level: 1, name: headingName })).toBeVisible()
  if (contentSelector) await expect(page.locator(contentSelector)).toBeVisible()
  await page.evaluate(async () => {
    await document.fonts.ready
    let previousHeight = document.documentElement.scrollHeight
    let stableFrames = 0
    while (stableFrames < 3) {
      await new Promise((resolve) => requestAnimationFrame(resolve))
      const currentHeight = document.documentElement.scrollHeight
      stableFrames = currentHeight === previousHeight ? stableFrames + 1 : 0
      previousHeight = currentHeight
    }
  })
}

test.describe('module accessibility', () => {
  for (const moduleId of moduleIds) {
    test(`${moduleId} has no accessibility violations`, async ({ page }) => {
      await page.goto(`/modules/${moduleId}`)
      await waitForVisualReady(page, moduleNames.get(moduleId), '#examples')

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
    })
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

test('foundations documents the supported visual theming hooks', async ({ page }) => {
  await page.goto('/foundations')
  await expect(page.getByRole('heading', { name: 'Visual tokens' })).toBeVisible()
  await expect(page.getByText('--teal-radius-control', { exact: true })).toBeVisible()
  await expect(page.getByText('--teal-icon-sm', { exact: true })).toBeVisible()
  await expect(page.getByText('--teal-motion-standard', { exact: true })).toBeVisible()
  await expect(page.getByText('--teal-shadow-overlay', { exact: true })).toBeVisible()
})

test('visual QA typography is locally served and ready before capture', async ({ page }) => {
  await page.goto('/visual-qa')
  await expect(page.getByRole('heading', { level: 1, name: 'Visual QA' })).toBeVisible()
  const typography = await page.evaluate(async () => {
    await document.fonts.ready
    return {
      externalStylesheet: [...document.styleSheets].some((sheet) => {
        if (!sheet.href) return false
        const url = new URL(sheet.href)
        return url.protocol === 'https:' && url.hostname === 'fonts.googleapis.com'
      }),
      manrope: [...document.fonts].some((font) => font.family === 'Manrope' && font.status === 'loaded'),
      jakarta: [...document.fonts].some((font) => font.family === 'Plus Jakarta Sans' && font.status === 'loaded'),
    }
  })
  expect(typography.externalStylesheet).toBe(false)
  expect(typography.manrope).toBe(true)
  expect(typography.jakarta).toBe(true)
})

test('module pages match the approved desktop visual baseline', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || isMobile, 'Stable visual baseline uses desktop Chromium')
  await page.goto('/modules/button')
  await waitForVisualReady(page, 'Button', '#examples')
  await expect(page).toHaveScreenshot('button-module-light.png', { fullPage: true, maxDiffPixels: 500 })
  await page.getByRole('button', { name: 'Dark mode' }).click()
  await expect(page).toHaveScreenshot('button-module-dark.png', { fullPage: true, maxDiffPixels: 500 })
})

test('visual QA surface covers every module family in both themes', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium', 'Stable visual baseline uses Chromium')
  await page.goto('/visual-qa')
  await waitForVisualReady(page, 'Visual QA')
  for (const family of ['Actions', 'Forms', 'Surfaces', 'Overlays', 'Feedback', 'Navigation', 'Data']) {
    await expect(page.getByRole('heading', { level: 2, name: family })).toBeVisible()
  }
  const viewport = isMobile ? 'mobile' : 'desktop'
  if (isMobile) {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  }
  await expect(page).toHaveScreenshot(`visual-qa-${viewport}-light.png`, { fullPage: true, maxDiffPixels: 600 })
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  await expect(page).toHaveScreenshot(`visual-qa-${viewport}-dark.png`, { fullPage: true, maxDiffPixels: 600 })
})

test('overlay modules match their approved open-state baselines', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || isMobile, 'Stable overlay baseline uses desktop Chromium')
  await page.goto('/visual-qa')
  await waitForVisualReady(page, 'Visual QA')

  await page.getByRole('button', { name: 'Open dialog' }).click()
  const dialog = page.getByRole('dialog', { name: 'Archive project?' })
  await expect(dialog).toHaveScreenshot('visual-qa-dialog-open.png')
  await page.getByRole('button', { name: 'Close' }).click()
  await expect(dialog).toBeHidden()

  await page.reload()
  await waitForVisualReady(page, 'Visual QA')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('menu')).toHaveScreenshot('visual-qa-menu-open.png')

  await page.reload()
  await waitForVisualReady(page, 'Visual QA')
  await page.getByRole('button', { name: 'Open popover' }).click()
  await expect(page.getByRole('dialog', { name: 'Workspace filters' })).toHaveScreenshot('visual-qa-popover-open.png')
})

test('transient interactions match their approved state baselines', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || isMobile, 'Stable interaction baseline uses desktop Chromium')
  await page.goto('/visual-qa')
  await waitForVisualReady(page, 'Visual QA')

  const primary = page.getByRole('button', { name: 'Primary action' })
  await primary.hover()
  await expect(primary).toHaveScreenshot('visual-qa-button-hover.png', { maxDiffPixels: 2 })
  await primary.click({ position: { x: 20, y: 20 }, delay: 200 })
  await primary.hover()
  await page.mouse.down()
  await page.waitForTimeout(200)
  // Chromium rasterizes the scaled active edge slightly differently on CI; keep this below 1%.
  await expect(primary).toHaveScreenshot('visual-qa-button-active.png', { maxDiffPixels: 40 })
  await page.mouse.up()

  await page.getByRole('button', { name: 'Search' }).hover()
  const tooltip = page.locator('[data-radix-popper-content-wrapper]').filter({ hasText: 'Search all workspaces' })
  await expect(tooltip).toHaveScreenshot('visual-qa-tooltip-open.png')

  await page.reload()
  await waitForVisualReady(page, 'Visual QA')
  await page.getByRole('combobox', { name: 'Owner' }).click()
  await expect(page.getByRole('listbox')).toHaveScreenshot('visual-qa-select-open.png')

  await page.reload()
  await waitForVisualReady(page, 'Visual QA')
  await page.getByRole('button', { name: 'Show toast' }).click()
  const toast = page.getByText('Import complete', { exact: true }).locator('xpath=ancestor::*[@data-state][1]')
  await expect(toast).toHaveScreenshot('visual-qa-toast-open.png')
})

test('visual interactions respect reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/visual-qa')
  await waitForVisualReady(page, 'Visual QA')
  const primary = page.getByRole('button', { name: 'Primary action' })
  const transitionSeconds = await primary.evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration))
  expect(transitionSeconds).toBeLessThanOrEqual(0.00001)
  await page.getByRole('button', { name: 'Open dialog' }).click()
  await expect(page.getByRole('dialog', { name: 'Archive project?' })).toHaveCSS('animation-name', 'none')
})

test('visual states expose focus, disabled, loading, invalid, and selected feedback', async ({ page }) => {
  await page.goto('/visual-qa')
  await waitForVisualReady(page, 'Visual QA')
  const primary = page.getByRole('button', { name: 'Primary action' })
  await primary.focus()
  expect(await primary.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe('none')
  await expect(page.getByRole('button', { name: 'Disabled' })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Saving' })).toHaveAttribute('aria-busy', 'true')
  await expect(page.getByRole('textbox', { name: 'Description' })).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
})
