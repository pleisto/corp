import { CommonPage } from '@/tests/common/common.page'
import { Locator } from '@playwright/test'
import { MENUBAR_SELECTOR } from '../../settingPage/setting.selector'
import { SECTION_SELECTOR } from './section.selector'


export class SectionPage extends CommonPage {
  getMenubarUnfold(): Locator {
    return this.page.locator(MENUBAR_SELECTOR.menubarUnfold)
  }

  getGeneralPage(): Locator {
    return this.page.locator(SECTION_SELECTOR.generalPage)
  }

  getTeamSpacePage(): Locator {
    return this.page.locator(SECTION_SELECTOR.teamSpacePage)
  }

  getAccountPage(): Locator {
    return this.page.locator(SECTION_SELECTOR.accountPage)
  }

  async generalPage(): Promise<void> {
    await this.waitForResponseWithAction('GetCurrentSpace', this.getGeneralPage().click())
  }

  async accountPage(): Promise<void> {
    await this.waitForResponseWithAction('GetCurrentSpace', this.getAccountPage().click())
  }

  getMenuItem(spaceName: string): Locator {
    return this.page.locator(MENUBAR_SELECTOR.menuItem(spaceName))
  }

  async switchSpaceSetting(spaceName: string): Promise<void> {
    await this.getMenubarUnfold().click()
    await this.waitForResponseWithAction('GetCurrentSpace', this.getMenuItem(spaceName).click())
  }

  // back to space page
  getBackToSpace(): Locator {
    return this.page.locator(SECTION_SELECTOR.backToSpace)
  }

  async backToSpace(): Promise<void> {
    await this.waitForResponseWithAction('GetPageBlocks', this.getBackToSpace().click())
  }
}
