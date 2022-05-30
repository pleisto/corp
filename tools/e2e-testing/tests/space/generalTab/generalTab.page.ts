import { Locator } from '@playwright/test'
import { CommonPage } from '@/tests/common/common.page'
import { GENERAL_TAB_SELECTOR } from './generalTab.selector'

export class GeneralTabPage extends CommonPage {
  getGeneralTabTitle(): Locator {
    return this.page.locator(GENERAL_TAB_SELECTOR.title)
  }

  getProfileNameInput(): Locator {
    return this.page.locator(GENERAL_TAB_SELECTOR.profile.nameInput)
  }

  getProfileBioInput(): Locator {
    return this.page.locator(GENERAL_TAB_SELECTOR.profile.bioInput)
  }

  getProfileUpdateButton(): Locator {
    return this.page.locator(GENERAL_TAB_SELECTOR.profile.updateButton)
  }

  getDomainInput(): Locator {
    return this.page.locator(GENERAL_TAB_SELECTOR.domain.input)
  }

  getDomainUpdateButton(): Locator {
    return this.page.locator(GENERAL_TAB_SELECTOR.domain.updateButton)
  }

  getDomainLearnMore(): Locator {
    return this.page.locator(GENERAL_TAB_SELECTOR.domain.learnMore)
  }

  async updateProfileName(name: string): Promise<void> {
    await this.getProfileNameInput().fill(name)
    await this.waitForResponseWithAction('createOrUpdateSpace', this.getProfileUpdateButton().click())
  }

  async updateProfileBio(bio: string): Promise<void> {
    await this.getProfileBioInput().fill(bio)
    await this.getProfileUpdateButton().click()
  }

  async updateDomainName(name: string): Promise<void> {
    await this.getDomainInput().fill(name)
    await this.getDomainUpdateButton().click()
  }

  async domainLearnMore(): Promise<void> {
    await this.getDomainLearnMore().click()
  }
}
