import { test, expect } from '@/fixtures'
import { SpacePage } from '@/pages/space/SpacePage'

test.describe('space', () => {
  let spacePage: SpacePage

  test.beforeEach(async ({ page }) => {
    spacePage = new SpacePage(page)
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('Verify space create', async ({ page }) => {
    await spacePage.createSpace('newSpace')
    await expect(spacePage.getMenu()).toContainText('newSpace')
  })
})
