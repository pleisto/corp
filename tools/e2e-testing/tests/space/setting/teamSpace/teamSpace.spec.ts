import { test, expect } from '@/fixtures'
import { SettingPage } from '@/tests/space/settingPage/setting.page'
import { SpacePage } from '@/tests/space/create/create.page'
import { TeamSpacePage } from './teamSpace.page'



test.describe('teamSpace', () => {
  let spacePage: SpacePage
  let teamSpace: TeamSpacePage
  let settingPage: SettingPage

  test.beforeEach(async ({ page }) => {
    spacePage = new SpacePage(page)
    teamSpace = new TeamSpacePage(page)
    settingPage = new SettingPage(page)
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('Verify InviteLinkReset', async ({ page }) => {
    await spacePage.createSpace('test003')
    await settingPage.settingPage('test003')
    await teamSpace.InviteLinkReset()
    expect(teamSpace.getEnableInviteBtn()).toBeTruthy()
  })

  test('Verify space delete', async ({ page }) => {
    await settingPage.settingPage('test003')
    await teamSpace.deleteSpace('test003')
    expect(settingPage.getMenu()).toBeTruthy()
  })
})
