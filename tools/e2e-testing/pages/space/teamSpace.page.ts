import { TEAM_SPACE_SELECTOR } from '@/selectors/space/space.selector'
import { Locator } from '@playwright/test'
import { BasePage } from '../BasePage'

export class TeamSpacePage extends BasePage {
  // team Space page
  getTeamSpacePage(): Locator {
    return this.page.locator(TEAM_SPACE_SELECTOR.teamSpacePage)
  }

  // inviteLink
  getEnableInviteBtn(): Locator {
    return this.page.locator(TEAM_SPACE_SELECTOR.enableInviteBtn)
  }

  getInviteLink(): Locator {
    return this.page.locator(TEAM_SPACE_SELECTOR.inviteLink)
  }

  getResetBtn(): Locator {
    return this.page.locator(TEAM_SPACE_SELECTOR.resetBtn)
  }

  getResetConfirm(): Locator {
    return this.page.locator(TEAM_SPACE_SELECTOR.resetConfirm)
  }

  async InviteLinkReset(): Promise<void> {
    await this.getTeamSpacePage().click()
    await this.getEnableInviteBtn().click()
    await this.getResetBtn().click()
    await this.waitForResponseWithAction('createOrUpdateSpace', this.getResetConfirm().click())
  }

  // delete space
  getDeleteBtn(): Locator {
    return this.page.locator(TEAM_SPACE_SELECTOR.deleteBtn)
  }

  getDeleteConfirm(): Locator {
    return this.page.locator(TEAM_SPACE_SELECTOR.deleteConfirm)
  }

  async deleteSpace(spaceName: string): Promise<void> {
    await this.getTeamSpacePage().click()
    await this.getDeleteBtn().click()
    await this.page.fill(TEAM_SPACE_SELECTOR.deleteInput, spaceName)
    await this.waitForResponseWithAction('GetSpaces', this.getDeleteConfirm().click())
  }
}
