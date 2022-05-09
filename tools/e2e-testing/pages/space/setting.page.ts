import { BasePage } from '../BasePage'
import { GENERAL_SELECTOR, MENUBAR_SELECTOR, SECTION_SELECTOR } from '@/selectors/space/space.selector'
import { Locator } from '@playwright/test'

export class SettingPage extends BasePage {
  getMenu(): Locator {
    return this.page.locator(MENUBAR_SELECTOR.menu)
  }

  getSectionHeader(): Locator {
    return this.page.locator(SECTION_SELECTOR.sectionHeader)
  }

  static settingPage: any
  getMenubarUnfold(): Locator {
    return this.page.locator(MENUBAR_SELECTOR.menubarUnfold)
  }

  getSettingIcon(spaceText: string): Locator {
    return this.page.locator(MENUBAR_SELECTOR.settingIcon(spaceText))
  }

  async settingPage(spaceText: string): Promise<void> {
    await this.getMenubarUnfold().click()
    await this.getSettingIcon(spaceText).click({ force: true })
  }

  getGeneralPage(): Locator {
    return this.page.locator(GENERAL_SELECTOR.generalPage)
  }
}
