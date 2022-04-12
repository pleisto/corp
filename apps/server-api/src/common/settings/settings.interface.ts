const REFLECT_METADATA_PREFIX = 'brickdoc-settings:'
export const CONFIG_MAP_NAME_METADATA = `${REFLECT_METADATA_PREFIX}configMapName`
export const ITEM_OPTIONS_METADATA = `${REFLECT_METADATA_PREFIX}itemOptions`

// todo: add mutual exclusion for `public` and `encrypted` properties
export interface ItemOptions {
  /**
   * The public fields will be exposed to the client.
   */
  clientExposed?: boolean

  /**
   * Enabled data at rest encryption.
   */
  encrypted?: boolean

  /**
   * Static item will not read/write from/to the database.
   * It's value will be get from the ConfigMap file directly.
   */
  static?: boolean
}
