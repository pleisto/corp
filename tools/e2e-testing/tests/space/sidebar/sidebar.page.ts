import { Locator } from '@playwright/test'
import { CommonPage } from '@/tests/common/common.page'
import { SpaceSettingTab, SPACE_SIDEBAR_SELECTOR } from './sidebar.selector'
import { COMMON_SELECTORS } from '@/tests/common/common.selector'
import { PageTreePage } from '@/tests/sidebar/pageTree/pageTree.page'
import { GeneralTabPage } from '../generalTab/generalTab.page'
import { TeamSpacePage } from '../teamSpace/teamSpace.page'
import { AccountPage } from '../account/account.page'

type SidebarTabPage = GeneralTabPage | TeamSpacePage | AccountPage

export class SpaceSidebarPage extends CommonPage {
  getCurrentSpaceName(): Locator {
    return this.page.locator(SPACE_SIDEBAR_SELECTOR.currentSpaceName)
  }

  getOpenSwitchSpaceMenuButton(): Locator {
    return this.page.locator(SPACE_SIDEBAR_SELECTOR.openMenuButton)
  }

  getSpacesByIndex(index: number = 0): Locator {
    return this.page.locator(COMMON_SELECTORS.menubarItems).nth(index)
  }

  getBackToSpaceButton(): Locator {
    return this.page.locator(SPACE_SIDEBAR_SELECTOR.backToSpaceButton)
  }

  getSideBarTab(tab: SpaceSettingTab): Locator {
    return this.page.locator(SPACE_SIDEBAR_SELECTOR.settingTab(tab))
  }

  async switchSpace(index: number = 0): Promise<void> {
    await this.getOpenSwitchSpaceMenuButton().click()
    await this.getSpacesByIndex(index).click()
    await this.page.waitForNavigation()
  }

  async toggleTab(tab: SpaceSettingTab): Promise<SidebarTabPage> {
    await this.getSideBarTab(tab).click()

    switch (tab) {
      case SpaceSettingTab['Team Space']:
        return new TeamSpacePage(this.page)
      case SpaceSettingTab.Account:
        return new AccountPage(this.page)
      default:
        return new GeneralTabPage(this.page)
    }
  }

  async backToSpace(): Promise<PageTreePage> {
    await this.getBackToSpaceButton().click()
    await this.page.waitForNavigation()
    return new PageTreePage(this.page)
  }
}
