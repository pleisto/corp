import { BasePage } from '../BasePage'
import { MENUBAR_SELECTOR } from '@/selectors/space/space'
import { Locator } from '@playwright/test'

export class SettingPage extends BasePage {
  static settingPage: any
  getMenubarUnfold(): Locator {
    return this.page.locator(MENUBAR_SELECTOR.menubarUnfold)
  }

  getSettingIcon(spaceText: string): Locator {
    return this.page.locator(MENUBAR_SELECTOR.settingIcon(spaceText))
  }

  getMenu(): Locator {
    return this.page.locator(MENUBAR_SELECTOR.menu)
  }

  async settingPage(spaceText: string): Promise<void> {
    await this.getMenubarUnfold().click()
    await this.getSettingIcon(spaceText).click({ force: true })
  }
}
