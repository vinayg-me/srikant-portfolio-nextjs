import { test, expect } from '@playwright/test'

test('should load landing page sanity check', async ({ page }) => {
  await page.goto('/')
  // Simple check to ensure we got a page response
  const body = page.locator('body')
  await expect(body).toBeVisible()
})
