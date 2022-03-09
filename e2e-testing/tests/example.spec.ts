import { expect } from '@playwright/test'
import { test } from '../utils/baseFixtures'

test.describe('example', () => {
  // eslint-disable-next-line jest/no-done-callback
  test('goto Brickdoc', async ({ page }) => {
    await page.goto('https://trunk.brickdoc.dev')
    await expect(page.locator('[name=email]')).toHaveAttribute('type', 'email')
  })
})
