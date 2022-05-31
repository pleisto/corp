import { test } from '@/fixtures'
import { SpaceSidebarPage } from '../sidebar/sidebar.page'
import { SpaceSettingTab } from '../sidebar/sidebar.selector'
import { SwitchSpaceMenuPage } from '../switchSpaceMenu/switchSpaceMenu.page'
import { AccountPage } from './account.page'

test.describe('Team Space', () => {
  let switchSpaceMenu: SwitchSpaceMenuPage
  let spaceSideBar: SpaceSidebarPage
  let account: AccountPage

  test.beforeEach(async ({ api }) => {
    await api.destroyAllCreatedSpace()
    ;[, spaceSideBar] = await switchSpaceMenu.gotoPersonalSetting()
    account = (await spaceSideBar.toggleTab(SpaceSettingTab.Account)) as AccountPage
  })

  test('not as a owner of a space, can delete account', async () => {
    await account.deleteAccount()
  })

  /**
   * TODO:
   * 1. join space, leave space
   * 2. as a owner of a space, can not delete account
   * 3. not as a owner of a space, can delete account
   */
})
