import { Injectable } from '@nestjs/common'
import { ConfigMapExplorer } from './config-map.explorer'
import { SettingsItem, SCOPE_ROOT_NODE } from './settings.interface'
import { InjectPool, DatabasePool } from '@brickdoc/nestjs-slonik'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { KMSService } from '../kms'
import { createOrUpdateSetting, findSetting } from './settings.sql-builder'

@Injectable()
export class SettingsService {
  constructor(
    readonly explorer: ConfigMapExplorer,
    private readonly kms: KMSService,
    @InjectPool() private readonly pool: DatabasePool,
    @InjectPinoLogger('SettingsService') private readonly logger: PinoLogger
  ) {}

  /**
   * Get a setting value
   * @param key
   * @param scope
   */
  async get<I, K extends keyof I = keyof I>(key: K, scope?: string): Promise<K | undefined> {
    const item = this.explorer.getItemByKey<K>(key as string)
    if (!item) return undefined
    return (await this.findItemValue<K>(item, this.scopeWrapper(scope))).value
  }

  /**
   * Update a setting value on the database
   * @param key
   * @param value
   * @param scope
   */
  async update<I, K extends keyof I = keyof I>(key: K, value: I[K], scope?: string): Promise<boolean> {
    // todo: add class-validator support.
    const item = this.explorer.getItemByKey<K>(key as string)
    if (!item) {
      this.logger.error('Cannot find key `%s` in any ConfigMap. Only the defined items can be updated.', key)
      return false
    }
    if (item.options.static) {
      this.logger.error(' Item `%s` has been set to `{static: true}`, so it cannot be updated.', key)
      return false
    }

    const wrappedScope = this.scopeWrapper(scope)
    // encrypt value if needed
    const storedValue = item.options.encrypted ? this.kms.symmetricEncrypt(JSON.stringify(value), wrappedScope) : value

    return await createOrUpdateSetting(this.pool, key as string, storedValue, wrappedScope)
  }

  /**
   * Make sure that the scope must be a descendant of the root node
   */
  protected scopeWrapper(scope: string | undefined): string {
    if (scope === SCOPE_ROOT_NODE || scope === undefined) return SCOPE_ROOT_NODE
    if (scope.startsWith(`${SCOPE_ROOT_NODE}.`)) return scope
    return `${SCOPE_ROOT_NODE}.${scope}`
  }

  /**
   * find a setting item by key and scope
   */
  protected async findItemValue<T>(item: SettingsItem<T>, scope: string): Promise<SettingsItem<T>> {
    const localItem = { ...item, value: item.defaultValue }
    if (item.options.static) return localItem

    const result = await findSetting<T>(this.pool, item.key, this.scopeWrapper(scope))
    if (!result) return localItem
    item.value = result

    if (item.value && item.options.encrypted) {
      const plain = this.kms.symmetricDecrypt(item.value as unknown as string, scope)
      item.value = JSON.parse(plain) as T
    }
    return item
  }
}
