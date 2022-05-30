import { test, expect } from '@/fixtures'
import { SwitchSpaceMenuPage } from './switchSpaceMenu.page'

test.describe('Switch Space Menu', () => {
  let switchSpaceMenu: SwitchSpaceMenuPage

  test.beforeEach(async ({ api, page }) => {
    switchSpaceMenu = new SwitchSpaceMenuPage(page)
    await api.destroyAllCreatedSpace()
    await api.pageReload()
  })

  test('Verify that create space is working well', async ({ page }) => {
    const spaceName = 'test'
    await switchSpaceMenu.createSpace(spaceName)
    await page.waitForNavigation()

    await expect(switchSpaceMenu.getCurrentSpaceName()).toContainText(spaceName)
  })

  test('Verify that can switch to space when click it', async ({ api }) => {
    const spaceName = 'test'
    await api.createSpace(spaceName)
    await switchSpaceMenu.switchSpace(spaceName)

    await expect(switchSpaceMenu.getCurrentSpaceName()).toContainText(spaceName)
  })

  test('Verify it will logout when click logout button', async () => {
    const signIn = await switchSpaceMenu.logOut()

    await expect(signIn.getSignInTitle()).toContainText('Sign into Brickdoc')
  })

  test('Verify it will redirect to personal space setting page', async () => {
    const [generalTab] = await switchSpaceMenu.gotoPersonalSetting()

    await expect(generalTab.getGeneralTabTitle()).toContainText('User Profile')
  })

  test('Verify it will redirect to public space setting page', async () => {
    const [generalTab] = await switchSpaceMenu.gotoPublicSetting(1)

    await expect(generalTab.getGeneralTabTitle()).toContainText('Group Profile')
  })
})
