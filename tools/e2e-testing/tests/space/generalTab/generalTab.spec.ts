import { test, expect } from '@/fixtures'
import { SpaceSidebarPage } from '../sidebar/sidebar.page'
import { SwitchSpaceMenuPage } from '../switchSpaceMenu/switchSpaceMenu.page'
import { GeneralTabPage } from './generalTab.page'

test.describe('General Tab', () => {
  let switchSpaceMenu: SwitchSpaceMenuPage
  let generalTab: GeneralTabPage
  let spaceSideBar: SpaceSidebarPage
  const spaceName = 'e2eTestSpace'

  test.beforeEach(async () => {
    ;[generalTab, spaceSideBar] = await switchSpaceMenu.gotoPersonalSetting()
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

    test('Verify it will open uploader when click avatar', async () => {})

    test('Verify avatar will be updated when upload photo', async () => {})
  })

  test.describe('Domain', () => {
    test('Verify update domain name is working well', async () => {})
    test('Verify it will open a new tab when click learn moe', async () => {})
  })

  test.describe('Display', () => {
    test('Verify select timezone is working well', async () => {})
    test('Verify select language is working well', async () => {})
  })
  /**
   * profile
   * 1. 确认修改name，sidebar 名字也随之更改
   * 2. 确认修改bio，刷新页面后，bio显示正确
   * 3. 确认点击修改头像，弹出文件上传框
   * 4. 确认上传头像，sidebar 头像也随之更改
   *
   * domain
   * 1. 确认修改domain name，刷新后，name input 显示为修改之后的值
   * 2. 确认点击learn more，会打开另外一个页面
   *
   * display
   * 1. 选择timezone，刷新页面，确认当前为修改后的选项
   * 1. 选择language，刷新页面，确认当前为修改后的选项
   */
})
