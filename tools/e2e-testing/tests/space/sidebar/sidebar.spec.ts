import { test, expect } from '@/fixtures'
import { SwitchSpaceMenuPage } from '../switchSpaceMenu/switchSpaceMenu.page'
import { SpaceSidebarPage } from './sidebar.page'
import { SpaceSettingTab } from './sidebar.selector'

test.describe('Space Sidebar', () => {
  let switchSpaceMenu: SwitchSpaceMenuPage
  let spaceSideBar: SpaceSidebarPage
  const spaceName = 'testSpace'

  test.beforeEach(async ({ api }) => {
    await api.destroyAllCreatedSpace()
    await api.createSpace(spaceName)

    ;[, spaceSideBar] = await switchSpaceMenu.gotoPersonalSetting()
  })

  test('Verify switch spaces is working well', async () => {
    await spaceSideBar.switchSpace(1)

    await expect(spaceSideBar.getCurrentSpaceName()).toContainText(spaceName)
  })

  test('Verify back to space when click button', async () => {
    const page = await spaceSideBar.backToSpace()

    await expect(page.getAddPageButton()).toBeVisible()
  })

  test('Verify that default tab is General', async () => {
    await expect(spaceSideBar.getSideBarTab(SpaceSettingTab.General)).toHaveClass(/active/)
  })

  test('Verify toggle to Account setting page when click Account Tab', async () => {
    await spaceSideBar.toggleTab(SpaceSettingTab.Account)

    await expect(spaceSideBar.getSideBarTab(SpaceSettingTab.General)).not.toHaveClass(/active/)
    await expect(spaceSideBar.getSideBarTab(SpaceSettingTab.Account)).toHaveClass(/active/)
  })
})
