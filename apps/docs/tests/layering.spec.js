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
  await expect(menu).toBeVisible()

  // The menu must win hit-testing at its own center. With the old z-scale
  // the click landed on the dialog surface instead of the open menu.
  const box = (await menu.boundingBox()) ?? { x: 0, y: 0, width: 0, height: 0 }
  const hitsMenu = await page.evaluate(
    ([x, y]) => document.elementFromPoint(x, y)?.closest('[role="menu"]') !== null,
    [box.x + box.width / 2, box.y + box.height / 2],
  )
  expect(hitsMenu).toBe(true)

  await menu.getByRole('menuitem', { name: 'Rename' }).click()
  await expect(page.getByTestId('last-action')).toHaveText('rename')
})
