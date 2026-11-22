import { expect, test } from '@playwright/test'

// Regression probe for the overlay z-scale: a menu opened from inside a
// dialog used to render under the dialog surface (popover 40 < dialog 51),
// so its items could not be clicked.
test('a menu opened inside a dialog renders above the dialog and stays clickable', async ({ page }) => {
  await page.goto('/overlay-layering')
  await page.getByRole('button', { name: 'Open dialog' }).click()
  const dialog = page.getByRole('dialog', { name: 'Layering probe' })
  await expect(dialog).toBeVisible()

  await page.getByRole('button', { name: 'Project actions' }).click()
  const menu = page.getByRole('menu', { name: 'Project actions' })
  const rename = menu.getByRole('menuitem', { name: 'Rename' })
  await expect(rename).toBeVisible()

  // Wait for the menu item's center to receive pointer input as it opens.
  // With the old z-scale the dialog intercepted the click.
  await expect.poll(() => rename.evaluate((item) => {
    const { x, y, width, height } = item.getBoundingClientRect()
    return item.contains(document.elementFromPoint(x + width / 2, y + height / 2))
  })).toBe(true)

  await rename.click()
  await expect(page.getByTestId('last-action')).toHaveText('rename')
})
