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

      if (moduleId === 'dialog') {
        await page.locator('#examples').getByRole('button', { name: 'Open dialog' }).click()
        // Contrast measurements require the dialog's fully opaque state.
        await expect(page.getByRole('dialog', { name: 'Archive project?' })).toHaveCSS('opacity', '1')
      } else {
        if (moduleId === 'tooltip') await page.getByRole('button', { name: 'Open search' }).hover()
        if (moduleId === 'menu') await page.getByRole('button', { name: 'Project actions' }).click()
        if (moduleId === 'popover') await page.locator('#examples').getByRole('button', { name: 'Filters' }).first().click()
        if (moduleId === 'toast') await page.getByRole('button', { name: 'Show toast' }).click()
        await page.waitForTimeout(250)
      }

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
  const palette = page.getByRole('dialog', { name: 'Search the documentation' })
  await expect(palette.getByText('Select', { exact: true })).toBeVisible()
  await input.press('Enter')
  await expect(page).toHaveURL(/\/modules\/select$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Select' })).toBeVisible({ timeout: 10_000 })
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
  await expect(page).toHaveScreenshot('button-module-light.png', { fullPage: true, maxDiffPixels: 1500, animations: 'disabled' })
  await page.getByRole('button', { name: 'Dark mode' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page).toHaveScreenshot('button-module-dark.png', { fullPage: true, maxDiffPixels: 1000, animations: 'disabled' })
})

const baselinePages = [
  { path: '/modules/input', name: 'input', heading: 'Input' },
  { path: '/modules/alert', name: 'alert', heading: 'Alert' },
  { path: '/modules/table', name: 'table', heading: 'Table' },
]

test('form, feedback, and data module pages match their approved baselines', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || isMobile, 'Stable visual baseline uses desktop Chromium')
  for (const baseline of baselinePages) {
    await page.goto(baseline.path)
    await waitForVisualReady(page, baseline.heading, '#examples')
    await expect(page).toHaveScreenshot(`${baseline.name}-module-light.png`, { fullPage: true, maxDiffPixels: 1500, animations: 'disabled' })
    await page.getByRole('button', { name: 'Dark mode' }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page).toHaveScreenshot(`${baseline.name}-module-dark.png`, { fullPage: true, maxDiffPixels: 1000, animations: 'disabled' })
    await page.getByRole('button', { name: 'Light mode' }).click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  }
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
  const lightBaselineMaxDiffPixels = isMobile ? 600 : 650
  await expect(page).toHaveScreenshot(`visual-qa-${viewport}-light.png`, {
    fullPage: true,
    maxDiffPixels: lightBaselineMaxDiffPixels,
  })
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  await expect(page).toHaveScreenshot(`visual-qa-${viewport}-dark.png`, { fullPage: true, maxDiffPixels: 1200 })
})

test('visual QA surface mirrors correctly under RTL', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Stable visual baseline uses Chromium')
  await page.goto('/visual-qa')
  await waitForVisualReady(page, 'Visual QA')
  // Logical properties do the mirroring; the dir attribute flips the canvas.
  await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl'))
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
  await expect(page).toHaveScreenshot('visual-qa-rtl.png', { fullPage: true, maxDiffPixels: 1800, animations: 'disabled' })
  await page.evaluate(() => document.documentElement.removeAttribute('dir'))
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
  // The teal-focus-ring background-color transition is still settling right after hover();
  // disabling animations pins the capture to the final hover state.
  await expect(primary).toHaveScreenshot('visual-qa-button-hover.png', { maxDiffPixels: 30, animations: 'disabled' })
  await primary.click({ position: { x: 20, y: 20 }, delay: 200 })
  const primaryBox = await primary.boundingBox()
  await page.mouse.move(primaryBox.x + primaryBox.width / 2, primaryBox.y + primaryBox.height / 2)
  await page.mouse.down()
  // Gate on the pressed scale actually applying before the capture: a fixed
  // sleep can screenshot an unpressed button when the synthesized press is
  // slow, which diffed the whole element (141px vs the active 139px).
  await expect
    .poll(() =>
      primary.evaluate((element) => {
        const style = getComputedStyle(element)
        return `${style.transform} ${style.scale}`
      }),
    )
    .toMatch(/0\.98/)
  await expect(primary).toHaveScreenshot('visual-qa-button-active.png', { maxDiffPixels: 40 })
  await page.mouse.up()

  await page.getByRole('button', { name: 'Search' }).hover()
  const tooltip = page.locator('[data-radix-popper-content-wrapper]').filter({ hasText: 'Search all workspaces' })
  await expect(tooltip).toHaveScreenshot('visual-qa-tooltip-open.png')

  await page.reload()
  await waitForVisualReady(page, 'Visual QA')
  await page.getByRole('combobox', { name: 'Owner' }).click()
  await expect(page.getByRole('listbox')).toHaveScreenshot('visual-qa-select-open.png', { maxDiffPixels: 30 })

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

test('switch thumb stays inside its track in both states, sizes, and directions', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Geometry assertions run on the stable Chromium baseline')
  await page.goto('/modules/switch')
  await waitForVisualReady(page, 'Switch', '#examples')

  const measure = () =>
    page.evaluate(() => {
      const boxes = []
      for (const root of document.querySelectorAll('.teal-switch-root')) {
        const thumb = root.querySelector('.teal-switch-thumb')
        if (!thumb) continue
        const r = root.getBoundingClientRect()
        const t = thumb.getBoundingClientRect()
        boxes.push({
          state: root.getAttribute('data-state'),
          root: { left: r.left, right: r.right, top: r.top, bottom: r.bottom },
          thumb: { left: t.left, right: t.right, top: t.top, bottom: t.bottom },
        })
      }
      return boxes
    })

  for (const dir of ['ltr', 'rtl']) {
    // Radix Tabs pins dir="ltr" on its content panels, so drive direction at
    // the component root where a real RTL document would reach it.
    await page.evaluate((value) => {
      for (const root of document.querySelectorAll('.teal-switch-root')) {
        if (value === 'rtl') root.setAttribute('dir', 'rtl')
        else root.removeAttribute('dir')
      }
    }, dir)
    await page.waitForTimeout(300)
    const boxes = await measure()
    expect(boxes.length).toBeGreaterThan(0)
    for (const box of boxes) {
      // The thumb must clear the track's 1px border on every side; a thumb
      // sitting on the border box (the old overflow) fails here.
      expect(box.thumb.left, `${dir} ${box.state} thumb left edge`).toBeGreaterThanOrEqual(box.root.left + 1 - 0.5)
      expect(box.thumb.right, `${dir} ${box.state} thumb right edge`).toBeLessThanOrEqual(box.root.right - 1 + 0.5)
      expect(box.thumb.top, `${dir} ${box.state} thumb top edge`).toBeGreaterThanOrEqual(box.root.top + 1 - 0.5)
      expect(box.thumb.bottom, `${dir} ${box.state} thumb bottom edge`).toBeLessThanOrEqual(box.root.bottom - 1 + 0.5)

      const thumbCenter = (box.thumb.left + box.thumb.right) / 2
      const rootCenter = (box.root.left + box.root.right) / 2
      if (box.state === 'checked') {
        if (dir === 'ltr') expect(thumbCenter, `${dir} checked thumb sits toward the inline end`).toBeGreaterThan(rootCenter)
        else expect(thumbCenter, `${dir} checked thumb sits toward the inline end`).toBeLessThan(rootCenter)
      } else {
        if (dir === 'ltr') expect(thumbCenter, `${dir} unchecked thumb sits at inline start`).toBeLessThan(rootCenter)
        else expect(thumbCenter, `${dir} unchecked thumb sits at inline start`).toBeGreaterThan(rootCenter)
      }
    }
  }
  await page.evaluate(() => {
    for (const root of document.querySelectorAll('.teal-switch-root')) root.removeAttribute('dir')
  })
})

test('switch thumb travel respects reduced motion', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Computed-style assertions run on the stable Chromium baseline')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/modules/switch')
  await waitForVisualReady(page, 'Switch', '#examples')

  const transitions = await page.evaluate(() => {
    const thumbs = [...document.querySelectorAll('.teal-switch-root .teal-switch-thumb')]
    return thumbs.map((thumb) => {
      const style = getComputedStyle(thumb)
      return { property: style.transitionProperty, duration: style.transitionDuration }
    })
  })
  expect(transitions.length).toBeGreaterThan(0)
  for (const transition of transitions) {
    expect(transition.property.split(', ')).toContain('none')
  }
})

test('switch and button keep legible off and disabled states under forced colors', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Forced-colors emulation is only supported in Chromium')
  await page.emulateMedia({ forcedColors: 'active' })

  const systemColor = (name) =>
    page.evaluate((colorName) => {
      const probe = document.createElement('div')
      probe.style.color = colorName
      document.documentElement.appendChild(probe)
      const value = getComputedStyle(probe).color
      probe.remove()
      return value
    }, name)

  await page.goto('/modules/switch')
  await waitForVisualReady(page, 'Switch', '#examples')

  const offSwitch = page.getByRole('switch', { name: 'Weekly digest' })
  const offThumbColor = await offSwitch.locator('.teal-switch-thumb').evaluate((element) => getComputedStyle(element).backgroundColor)
  expect(offThumbColor).toBe(await systemColor('CanvasText'))

  const onSwitch = page.getByRole('switch', {
    name: 'Security notifications',
    description: 'Receive alerts for high-risk account activity',
  })
  const onTrackColor = await onSwitch.evaluate((element) => getComputedStyle(element).backgroundColor)
  expect(onTrackColor).toBe(await systemColor('Highlight'))
  const onThumbColor = await onSwitch.locator('.teal-switch-thumb').evaluate((element) => getComputedStyle(element).backgroundColor)
  expect(onThumbColor).toBe(await systemColor('HighlightText'))

  await page.goto('/modules/button')
  await waitForVisualReady(page, 'Button', '#examples')
  const disabledButton = page.getByRole('button', { name: 'Publish' })
  await expect(disabledButton).toBeDisabled()
  const disabledColor = await disabledButton.evaluate((element) => getComputedStyle(element).color)
  expect(disabledColor).toBe(await systemColor('GrayText'))
})

test('merged-away module routes redirect to their surviving page', async ({ page, context }) => {
  await page.goto('/modules/speed-dial')
  await expect(page).toHaveURL(/\/modules\/floating-action-button$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Floating Action Button' })).toBeVisible()

  // A fresh page: in Firefox a goto issued right after the client-side
  // history replace of the first redirect is aborted (NS_BINDING_ABORTED);
  // a clean docshell has no racing history entry.
  const second = await context.newPage()
  await second.goto('/modules/date-range-picker')
  await expect(second).toHaveURL(/\/modules\/date-picker$/)
  await expect(second.getByRole('heading', { level: 1, name: 'Date Picker' })).toBeVisible()
  await second.close()
})

test('sidebar marks only the current module as active', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'Documentation' })

  await page.goto('/modules/button-group')
  await expect(page.getByRole('heading', { level: 1, name: 'Button Group' })).toBeVisible()
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1)
  await expect(nav.locator('a.teal-u-font-semibold')).toHaveCount(1)
  await expect(nav.getByRole('link', { name: 'Button Group', exact: true })).toHaveAttribute('aria-current', 'page')

  await page.goto('/modules/toggle-group')
  await expect(page.getByRole('heading', { level: 1, name: 'Toggle Group' })).toBeVisible()
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1)
  await expect(nav.locator('a.teal-u-font-semibold')).toHaveCount(1)
  await expect(nav.getByRole('link', { name: 'Toggle Group', exact: true })).toHaveAttribute('aria-current', 'page')
})

test('fixed-position demos render inside their preview box', async ({ page }) => {
  await page.goto('/modules/floating-action-button')
  await expect(page.getByRole('heading', { level: 1, name: 'Floating Action Button' })).toBeVisible()
  const fab = page.getByRole('button', { name: 'Create item' })
  await expect(fab).toBeVisible()
  const buttonBox = await fab.boundingBox()
  const previewBox = await page.locator('#examples .docs-grid').first().boundingBox()
  expect(buttonBox.x).toBeGreaterThanOrEqual(previewBox.x)
  expect(buttonBox.y).toBeGreaterThanOrEqual(previewBox.y)
  expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(previewBox.x + previewBox.width)
  expect(buttonBox.y + buttonBox.height).toBeLessThanOrEqual(previewBox.y + previewBox.height)
})

test('rendered demos contain no placeholder external links', async ({ page }) => {
  for (const route of ['/modules/notification-item', '/modules/link', '/modules/launcher-card', '/modules/app-switcher', '/modules/ecosystem-rail']) {
    await page.goto(route)
    await expect(page.locator('#examples')).toBeVisible()
    const hrefs = await page
      .locator('#examples a[href]')
      .evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')))
    for (const href of hrefs) expect(href).not.toMatch(/^https?:\/\/[a-z0-9.-]*\.example/)
  }
})

test('toasts dismiss with a pointer swipe', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'webkit', 'Swipe behavior is browser-level; exercise it outside the chromium visual project')
  await page.goto('/modules/toast')
  await page.getByRole('button', { name: 'Show toast' }).click()
  const toast = page.getByRole('status').filter({ hasText: 'Changes saved' })
  await expect(toast).toBeVisible()

  // Drag the toast right past the swipe threshold; Radix dismisses on release.
  const box = await toast.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  for (let step = 1; step <= 8; step += 1) {
    await page.mouse.move(box.x + box.width / 2 + step * 25, box.y + box.height / 2, { steps: 2 })
  }
  await page.mouse.up()
  await expect(toast).not.toBeVisible()
})
