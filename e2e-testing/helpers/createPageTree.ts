import { SIDEBAR_SELECTORS } from '@/selectors/sidebar'
import { Page } from '@playwright/test'

export interface PageTree {
  pageName: string
  parentNode?: string
}

export const createPageTree = async (page: Page, pageTrees: PageTree[]): Promise<void> => {
  for (let index = 0; index < pageTrees.length; index++) {
    const { pageName, parentNode } = pageTrees[index]
    if (!parentNode) {
      await page.locator(SIDEBAR_SELECTORS.mainActions.addPageButton).click()
    } else {
      const index = pageTrees.findIndex(item => item.pageName === parentNode)
      await page.locator(SIDEBAR_SELECTORS.mainActions.pageItem).nth(index).hover()
      await page.locator(SIDEBAR_SELECTORS.mainActions.addSubPageButton).nth(index).click()
    }

    const arrowClassName = await page.locator(SIDEBAR_SELECTORS.mainActions.arrow).nth(index).getAttribute('class')
    if (!arrowClassName?.includes('-isOpen-true')) {
      await page.locator(SIDEBAR_SELECTORS.mainActions.arrow).nth(index).click()
    }

    await page.locator(SIDEBAR_SELECTORS.mainActions.pageItem).nth(index).hover()
    await page.locator(SIDEBAR_SELECTORS.mainActions.moreActionButton).nth(index).click()
    await page.locator(SIDEBAR_SELECTORS.mainActions.actionButton('Rename')).nth(index).click()
    await page.fill(SIDEBAR_SELECTORS.mainActions.renameInput, pageName)
    await page.press(SIDEBAR_SELECTORS.mainActions.renameInput, 'Enter')
  }
}
