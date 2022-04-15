import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
const REFLECT_METADATA_PREFIX = 'brickdoc-settings:'
export const CONFIG_MAP_NAMESPACE_METADATA = `${REFLECT_METADATA_PREFIX}configMapNamespace`
export const ITEM_OPTIONS_METADATA = `${REFLECT_METADATA_PREFIX}itemOptions`
export const SCOPE_ROOT_NODE = 'root'

// todo: add mutual exclusion for `public` and `encrypted` properties
export interface ItemOptions {
  /**
   * The public fields will be exposed to the client.
   */
  clientExposed?: boolean

  /**
   * Enabled data at rest encryption.
   * if `static` is true, encrypted will be ignored.
   */
  encrypted?: boolean

  /**
   * Static item will not read/write from/to the database.
   * It's value will be get from the ConfigMap file directly.
   */
  static?: boolean
}

export interface ConfigMapProviders {
  [namespace: string]: InstanceWrapper
}

export interface SettingsItem<T extends unknown> {
  key: string
  value?: T
  defaultValue: T
  options: ItemOptions
}
