import { expect, test } from '@playwright/test'

test('loads the app shell', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Cãodápio')
  await expect(page.getByText('Cãodápio')).toBeVisible()
})
