import { Locator } from '@playwright/test'
import { CommonPage } from '@/tests/common/common.page'
import { CREATE_SELECTOR } from './create.selector'
import { MENUBAR_SELECTOR } from '../settingPage/setting.selector'

export class SpacePage extends CommonPage {
  getMenubarUnfold(): Locator {
    return this.page.locator(MENUBAR_SELECTOR.menubarUnfold)
  }

  getCreateSpaceItem(): Locator {
    return this.page.locator(CREATE_SELECTOR.createSpace)
  }

  getCreateBtn(): Locator {
    return this.page.locator(CREATE_SELECTOR.createBtn)
  }

  getSpaceUnfold(): Locator {
    return this.page.locator(MENUBAR_SELECTOR.menubarUnfold)
  }

  async createSpace(newSpaceName: string): Promise<void> {
    await this.getMenubarUnfold().click()
    await this.getCreateSpaceItem().click()
    await this.page.fill(CREATE_SELECTOR.spaceNameInput, newSpaceName)
    await this.waitForResponseWithAction('GetSpaces', this.getCreateBtn().click())
  }
}
