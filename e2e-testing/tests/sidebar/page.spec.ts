import { PageList } from '@/components/sidebar/PageList'
import { test, expect } from '@/fixtures/testFixtures'
import { rem2Pixel } from '@/helpers/utils/rem2Pixel'
import { SIDEBAR_SELECTORS } from '@/selectors/sidebar'

test.describe('Page List', () => {
  let pageList: PageList

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    pageList = new PageList(page)
    await pageList.addPage()
  })

  test.afterEach(async () => {
    await pageList.removePage()
  })

  test('Verify page can be added', async ({ page }) => {
    await expect(page.locator(SIDEBAR_SELECTORS.mainActions.pageSection)).toContainText('Pages')
  })

  test('Verify action button is visible when hover page', async () => {
    await pageList.hover()
    await expect(pageList.getMoreAction()).toBeVisible()
    await expect(pageList.getAddSubPageButton()).toBeVisible()
  })

  test('Verify page can collapse when click arrow', async () => {
    await pageList.getArrow().click()
    const arrowClass = await pageList.getArrow().getAttribute('class')
    expect(arrowClass).not.toMatch(/.+-isOpen-true.*/g)
  })

  test('Verify sub page can be added', async () => {
    await pageList.hover()
    await pageList.addSubPage()
    await expect(pageList.getSubPage()).toHaveCSS('width', rem2Pixel('1rem'))
  })
})
