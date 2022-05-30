import { Locator } from '@playwright/test'
import { CommonPage } from '@/tests/common/common.page'
import { SIGN_IN_SELECTOR } from './signIn.selector'

export class SignInPage extends CommonPage {
  getSignInTitle(): Locator {
    return this.page.locator(SIGN_IN_SELECTOR.signInTitle)
  }
}
