import { MENUBAR_SELECTOR } from '@/selectors/space/space'
import { Locator } from '@playwright/test'
import { BasePage } from '../BasePage'

export class SpacePage extends BasePage {
  //  space create
  getMenu(): Locator {
    return this.page.locator(MENUBAR_SELECTOR.menu)
  }

  getCreateSpaceItem(): Locator {
    return this.page.locator(MENUBAR_SELECTOR.createSpace)
  }

  getCreateBtn(): Locator {
    return this.page.locator(MENUBAR_SELECTOR.createBtn)
  }

  getSpaceUnfold(): Locator {
    return this.page.locator(MENUBAR_SELECTOR.menubarUnfold)
  }

  async createSpace(newSpaceName: string): Promise<void> {
    await this.getMenubarUnfold().click()
    await this.getCreateSpaceItem().click()
    await this.page.fill(MENUBAR_SELECTOR.spaceNameInput, newSpaceName)
    await this.waitForResponseWithAction('GetSpaces', this.getCreateBtn().click())
  }
}
