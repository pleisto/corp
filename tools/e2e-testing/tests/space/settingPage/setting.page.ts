import { CommonPage } from '@/tests/common/common.page'
import { Locator } from '@playwright/test'
import { MENUBAR_SELECTOR } from './setting.selector'

export class SettingPage extends CommonPage {
  getMenu(): Locator {
    return this.page.locator(MENUBAR_SELECTOR.menu)
  }

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
}
