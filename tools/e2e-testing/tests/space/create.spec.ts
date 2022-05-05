import { test, expect } from '@/fixtures'
import { SettingPage } from '@/pages/space/settingPage'
import { SpacePage } from '@/pages/space/SpacePage'
import { TeamSpacePage } from '@/pages/space/TeamSpacePage'

test.describe('space', () => {
  let spacePage: SpacePage
  let teamSpace: TeamSpacePage
  let settingPage: SettingPage

  test.beforeEach(async ({ page }) => {
    spacePage = new SpacePage(page)
    teamSpace = new TeamSpacePage(page)
    settingPage = new SettingPage(page)
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('Verify space create', async ({ page }) => {
    await spacePage.createSpace('newSpace')
    await expect(settingPage.getMenu()).toContainText('newSpace')
    await settingPage.settingPage('newSpace')
    await teamSpace.deleteSpace('newSpace')
  })
})
