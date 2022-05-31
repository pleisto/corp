import { Locator } from '@playwright/test'
import { CommonPage } from '@/tests/common/common.page'
import { TEAM_SPACE_SELECTOR } from './teamSpace.selector'
import { ActionType } from '@/tests/common/common.selector'
import { PageTreePage } from '@/tests/sidebar/pageTree/pageTree.page'

export class TeamSpacePage extends CommonPage {
  getInviteSwitch(): Locator {
    return this.page.locator(TEAM_SPACE_SELECTOR.inviteMember.switch)
  }

  getInviteInput(): Locator {
    return this.page.locator(TEAM_SPACE_SELECTOR.inviteMember.input)
  }

  getInviteLinkReset(): Locator {
    return this.page.locator(TEAM_SPACE_SELECTOR.inviteMember.reset)
  }

  getLeaveByIndex(index: number = 0): Locator {
    return this.page.locator(TEAM_SPACE_SELECTOR.members.leave(index))
  }

  getDeleteSpaceButton(): Locator {
    return this.page.locator(TEAM_SPACE_SELECTOR.deleteSpace.button)
  }

  async toggleInvite(status: 'enable' | 'disable'): Promise<void> {
    const enabled = (await this.getInviteSwitch().getAttribute('class'))?.includes('-checked-true')

    if (enabled && status === 'disable') {
      await this.getInviteSwitch().click()
    } else if (!enabled && status === 'enable') {
      await this.getItemsInMenubar().click()
    }
  }

  async resetInviteLink(): Promise<string> {
    await this.getInviteLinkReset().click()
    await this.getDialogActionButton(ActionType.Confirm).click()
    return await this.getInviteInput().inputValue()
  }

  async leaveTeam(index?: number): Promise<void> {
    await this.getLeaveByIndex(index).click()
  }

  async deleteSpace(spaceName: string): Promise<PageTreePage> {
    await this.getDeleteSpaceButton().click()
    await this.getDialogInput().fill(spaceName)
    await this.waitForResponseWithAction('SpaceDestroy', this.getDialogActionButton(ActionType['Delete Space']).click())
    await this.page.waitForNavigation()
    return new PageTreePage(this.page)
  }
}
