import { Locator } from '@playwright/test'
import { CommonPage } from '@/tests/common/common.page'
import { ActionType, COMMON_SELECTORS } from '@/tests/common/common.selector'
import { SWITCH_SPACE_MENU_SELECTOR } from './switchSpaceMenu.selector'
import { SignInPage } from '@/tests/account/signIn/signIn.page'
import { GeneralTabPage } from '../generalTab/generalTab.page'
import { SpaceSidebarPage } from '../sidebar/sidebar.page'

export class SwitchSpaceMenuPage extends CommonPage {
  getOpenSwitchSpaceMenuButton(): Locator {
    return this.page.locator(SWITCH_SPACE_MENU_SELECTOR.openMenuButton)
  }

  getCurrentSpaceName(): Locator {
    return this.page.locator(SWITCH_SPACE_MENU_SELECTOR.currentSpaceName)
  }

  getSpaceByName(name: string): Locator {
    return this.page.locator(COMMON_SELECTORS.menubarItems).locator(SWITCH_SPACE_MENU_SELECTOR.spaceName(name))
  }

  getSpaces(): Locator {
    return this.page.locator(COMMON_SELECTORS.menubarItems)
  }

  getCreateSpaceButton(): Locator {
    return this.page.locator(SWITCH_SPACE_MENU_SELECTOR.createSpace)
  }

  getLogOutButton(): Locator {
    return this.page.locator(SWITCH_SPACE_MENU_SELECTOR.logOutButton)
  }

  getSpaceInput(): Locator {
    return this.page.locator(SWITCH_SPACE_MENU_SELECTOR.spaceNameInput)
  }

  getSpaceSettingButton(index: number = 0): Locator {
    return this.page.locator(SWITCH_SPACE_MENU_SELECTOR.settingSpace(index))
  }

  async openSwitchSpaceMenu(): Promise<void> {
    await this.getOpenSwitchSpaceMenuButton().click()
  }

  async switchSpace(spaceName: string): Promise<void> {
    await this.getSpaceByName(spaceName).click()
  }

  async openCreateSpaceDialog(): Promise<void> {
    await this.getCreateSpaceButton().click()
  }

  async logOut(): Promise<SignInPage> {
    await this.getLogOutButton().click()
    await this.page.waitForNavigation()
    return new SignInPage(this.page)
  }

  async cancelCreateSpace(): Promise<void> {
    await this.openCreateSpaceDialog()
    await this.getDialogActionButton(ActionType.Cancel).click()
  }

  async createSpace(name: string): Promise<void> {
    await this.openCreateSpaceDialog()
    await this.getSpaceInput().fill(name)
    await this.getDialogActionButton(ActionType.Create).click()
  }

  async gotoPersonalSetting(): Promise<[GeneralTabPage, SpaceSidebarPage]> {
    await this.getSpaceSettingButton().click()
    await this.page.waitForNavigation()
    return [new GeneralTabPage(this.page), new SpaceSidebarPage(this.page)]
  }

  async gotoPublicSetting(index: number): Promise<[GeneralTabPage, SpaceSidebarPage]> {
    await this.getSpaceSettingButton(index).click()
    await this.page.waitForNavigation()
    return [new GeneralTabPage(this.page), new SpaceSidebarPage(this.page)]
  }
}
