import { CommonPage } from '@/tests/common/common.page'
import { Locator } from '@playwright/test'
import { DOMAIN_SELECTOR } from './changeDomain.selector'

export class ChangeDomainPage extends CommonPage {
  getUpdateBtn(): Locator {
    return this.page.locator(DOMAIN_SELECTOR.updateBtn)
  }

  getLearnMoreLink(): Locator {
    return this.page.locator(DOMAIN_SELECTOR.learnMoreLink)
  }

  async learnMoreLink(): Promise<void> {
    await this.getLearnMoreLink().click()
  }

  async changeDomain(domainRename: string): Promise<void> {
    await this.page.fill(DOMAIN_SELECTOR.domainNameInput, domainRename)
    await this.waitForResponseWithAction('GetSpaces', this.getUpdateBtn().click())
  }
}
