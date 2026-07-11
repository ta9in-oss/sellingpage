import { test, expect } from '@playwright/test'

// Scenario: a deployed store must render exactly the content the platform
// generated from the merchant's builder config. These assertions run against
// generator output (see e2e/fixture.ts + global-setup).

test.describe('storefront renders generated content', () => {
  test('shows the merchant hero headline and price', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('عنوان_فريد_للاختبار').first()).toBeVisible()
    await expect(page.getByText('4321').first()).toBeVisible()
  })

  test('shows the mapped features section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('ميزة أولى').first()).toBeVisible()
    await expect(page.getByText('شرح الميزة').first()).toBeVisible()
  })

  test('renders an order form the buyer can start filling', async ({ page }) => {
    await page.goto('/')
    // The order section anchors at #buy; at least one text input must be present.
    const inputs = page.locator('input, select, textarea')
    await expect(inputs.first()).toBeVisible({ timeout: 15_000 })
  })
})
