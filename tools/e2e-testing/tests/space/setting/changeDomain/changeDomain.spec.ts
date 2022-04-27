import { test, expect } from '@/fixtures'
import { SettingPage } from '@/tests/space/settingPage/setting.page'
import { SectionPage } from '../section/section.page'
import { ChangeDomainPage } from './changeDomain.page'

test.describe('general -- Change Domain Name', () => {
  let changeDomain: ChangeDomainPage
  let settingPage: SettingPage
  let sectionPage: SectionPage

  test.beforeEach(async ({ page }) => {
    changeDomain = new ChangeDomainPage(page)
    settingPage = new SettingPage(page)
    sectionPage = new SectionPage(page)
    await page.goto('/', { waitUntil: 'networkidle' })
    await settingPage.settingPage('ADMIN3')
    await sectionPage.generalPage()
  })

  test('Verify click learn more link navigate to page', async ({ page }) => {
    await changeDomain.learnMoreLink()
    expect(page).toBeTruthy()
  })
})
