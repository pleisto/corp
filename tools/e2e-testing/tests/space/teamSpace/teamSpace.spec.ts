import { test, expect } from '@/fixtures'
import { SpaceSidebarPage } from '../sidebar/sidebar.page'
import { SpaceSettingTab } from '../sidebar/sidebar.selector'
import { SwitchSpaceMenuPage } from '../switchSpaceMenu/switchSpaceMenu.page'
import { TeamSpacePage } from './teamSpace.page'

test.describe('Team Space', () => {
  let switchSpaceMenu: SwitchSpaceMenuPage
  let spaceSideBar: SpaceSidebarPage
  let teamSpace: TeamSpacePage
  const spaceName = 'testSpace'

  test.beforeEach(async ({ api }) => {
    await api.destroyAllCreatedSpace()
    await api.createSpace(spaceName)
    ;[, spaceSideBar] = await switchSpaceMenu.gotoPublicSetting(1)
    teamSpace = (await spaceSideBar.toggleTab(SpaceSettingTab['Team Space'])) as TeamSpacePage
  })

  test('Verify toggle invite link button is working well', async () => {
    await teamSpace.toggleInvite('enable')
    await expect(teamSpace.getInviteInput()).toBeVisible()

    await teamSpace.toggleInvite('disable')
    await expect(teamSpace.getInviteInput()).not.toBeVisible()
  })

  test('Verify it will generate a new link when click reset', async () => {
    const link = await teamSpace.getInviteInput().inputValue()
    const newLink = await teamSpace.resetInviteLink()

    expect(newLink).not.toEqual(link)
  })

  test('Verify that the first member can not leave', async () => {
    await expect(teamSpace.getLeaveByIndex()).toHaveAttribute('disabled', '')
  })

  test('Verify space can be removed', async () => {
    const page = await teamSpace.deleteSpace(spaceName)

    await expect(page.getAddPageButton()).toBeVisible()
  })

  /**
   * TODO:
   * 1. other user join space from invite link
   * 2. leave space which user is not a owner
   */
})
