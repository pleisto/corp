import { env } from 'process'
import { ConfigMap, Item } from '../common/settings'

@ConfigMap('core')
export class CoreConfigMap {
  /**
   * Application environment
   */
  @Item({ static: true })
  appEnv: string = env.NODE_ENV!

  /**
   * Application base URL, it's used to generate links in emails or other places
   */
  @Item({ clientExposed: true })
  appUrl: string = env.SERVER_BASE_URL ?? 'http://example.com/'

  /**
   * Enable https support
   * If enabled, the session cookies will be set to secure flag
   * @returns default value
   */
  @Item({})
  tlsEnabled(): boolean {
    // Don't use `this.appEnv` here, because value are not auto-updated when dependencies properties changed
    return env.NODE_ENV === 'production'
  }

  /**
   * Default language
   */
  @Item({ clientExposed: true })
  defaultLanguage: string = 'en-US'

  /**
   * Default timezone
   */
  @Item({ clientExposed: true })
  defaultTimezone: string = 'UTC'
}
