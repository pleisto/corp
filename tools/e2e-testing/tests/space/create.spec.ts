import { test, expect } from '@/fixtures'
import { SettingPage } from '@/pages/space/setting.page'
import { SpacePage } from '@/pages/space/space.page'

import { TeamSpacePage } from '@/pages/space/teamSpace.page'

test.describe('space create', () => {
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
