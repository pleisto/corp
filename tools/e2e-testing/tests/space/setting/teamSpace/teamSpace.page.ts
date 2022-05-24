import { Locator } from '@playwright/test'
import { CommonPage } from '@/tests/common/common.page'
import { TEAM_SPACE_SELECTOR } from './teamSpace.selector'
import { SECTION_SELECTOR } from '../section/section.selector'

export class TeamSpacePage extends CommonPage {
  getTeamSpacePage(): Locator {
    return this.page.locator(SECTION_SELECTOR.teamSpacePage)
  }

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

  getDeleteBtn(): Locator {
    return this.page.locator(TEAM_SPACE_SELECTOR.deleteBtn)
  }

  getDeleteConfirm(): Locator {
    return this.page.locator(TEAM_SPACE_SELECTOR.deleteConfirm)
  }

  async InviteLinkReset(): Promise<void> {
    await this.getTeamSpacePage().click()
    await this.getEnableInviteBtn().click({ force: true })
    await this.getResetBtn().click()
    await this.getResetConfirm().click()
    await this.waitForResponseWithAction('createOrUpdateSpace', this.getEnableInviteBtn().click({ force: true }))
  }

  async deleteSpace(spaceName: string): Promise<void> {
    await this.getTeamSpacePage().click()
    await this.getDeleteBtn().click()
    await this.page.fill(TEAM_SPACE_SELECTOR.deleteInput, spaceName)
    await this.waitForResponseWithAction('GetSpaces', this.getDeleteConfirm().click())
  }
}
