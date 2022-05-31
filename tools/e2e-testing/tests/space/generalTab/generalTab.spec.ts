import { test, expect } from '@/fixtures'
import path from 'path'
import { SpaceSidebarPage } from '../sidebar/sidebar.page'
import { SwitchSpaceMenuPage } from '../switchSpaceMenu/switchSpaceMenu.page'
import { GeneralTabPage } from './generalTab.page'

test.describe('General Tab', () => {
  let switchSpaceMenu: SwitchSpaceMenuPage
  let generalTab: GeneralTabPage
  let spaceSideBar: SpaceSidebarPage
  const spaceName = 'e2eTestSpace'

  test.beforeEach(async ({ api }) => {
    await api.destroyAllCreatedSpace()
    await api.createSpace('newSpace')
    ;[generalTab, spaceSideBar] = await switchSpaceMenu.gotoPublicSetting(1)
  })

  test.describe('Profile', () => {
    test('Verify rename space is working well', async () => {
      await generalTab.updateProfileName(spaceName)

      await expect(spaceSideBar.getCurrentSpaceName()).toContainText(spaceName)
    })

    test('Verify update bio is working well', async ({ page }) => {
      const bio = 'This is the bio'
      await generalTab.updateProfileBio(bio)
      await page.reload()

      await expect(generalTab.getProfileBioInput()).toContainText(bio)
    })

    test('Verify it will open uploader when click avatar', async () => {
      await generalTab.openUploadAvatarDialog()

      await expect(generalTab.getUploadDashboard()).toContainText('Local File')
    })

    test('Verify avatar will be updated when upload photo', async () => {
      await generalTab.updateAvatar(path.join(__dirname, './generalTab.data.jpg'))

      await expect(generalTab.getAvatar()).toHaveAttribute('src', /https*/)
    })
  })

  test.describe('Domain', () => {
    test('Verify update domain name is working well', async ({ page }) => {
      const domainName = 'testDomain'
      await generalTab.updateDomainName(domainName)
      await page.reload()

      await expect(generalTab.getDomainInput()).toContainText(domainName)
    })

    test('Verify it will open a new tab when click learn moe', async ({ context }) => {
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        generalTab.getDomainLearnMore().click() // Opens a new tab
      ])

      expect(newPage.url()).toContain('https://help.brickdoc.com/en/articles/5972616-brickdoc-username-policy')
    })
  })

  test.describe('Display', () => {
    test('Verify select timezone is working well', async () => {
      const timezone = 'Africa/Abidjan'
      await generalTab.updateTimezone(timezone)

      await expect(generalTab.getTimezoneInput()).toContainText(timezone)
    })

    test('Verify select language is working well', async () => {
      const language = '简体中文'
      await generalTab.updateLanguage(language)

      await expect(generalTab.getLanguageInput()).toContainText(language)
    })
  })
})
