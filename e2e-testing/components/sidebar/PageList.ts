import { Locator, Page } from '@playwright/test'
import { SIDEBAR_SELECTORS } from '@/selectors/sidebar'

export class PageList {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  getAddSubPageButton(): Locator {
    return this.page.locator(SIDEBAR_SELECTORS.mainActions.addSubPageButton).first()
  }

  getMoreAction(): Locator {
    return this.page.locator(SIDEBAR_SELECTORS.mainActions.moreActionButton).first()
  }

  getSubPage(): Locator {
    return this.page.locator(SIDEBAR_SELECTORS.mainActions.subPageIndent).nth(1)
  }

  getRemoveButton(): Locator {
    return this.page.locator(SIDEBAR_SELECTORS.mainActions.actionButton('Delete'))
  }

  getArrow(): Locator {
    return this.page.locator(SIDEBAR_SELECTORS.mainActions.arrow).nth(0)
  }

  async hover(position?: { x: number; y: number }): Promise<void> {
    await this.page.hover(SIDEBAR_SELECTORS.mainActions.pageItem, { position })
  }

  async addPage(): Promise<void> {
    await this.page.locator(SIDEBAR_SELECTORS.mainActions.addPageButton).click()
  }

  async addSubPage(): Promise<void> {
    await this.hover()
    await this.getAddSubPageButton().click()
  }

  async removePage(): Promise<void> {
    await this.hover()
    await this.getMoreAction().click()
    await this.getRemoveButton().click()
  }
}
