import { test, expect } from '@/fixtures'
import { SpacePage } from '@/tests/space/create/create.page'
import { SettingPage } from '@/tests/space/settingPage/setting.page'
import { TeamSpacePage } from '@/tests/space/setting/teamSpace/teamSpace.page'

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

  test('Verify space create', async () => {
    const spaceName = 'newSpace'
    await spacePage.createSpace(spaceName)
    await expect(settingPage.getMenu()).toContainText(spaceName)
    await settingPage.settingPage(spaceName)
    await teamSpace.deleteSpace(spaceName)
  })
})
