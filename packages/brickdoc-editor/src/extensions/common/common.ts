import {
  Mark,
  MarkConfig as TipTapMarkConfig,
  NodeConfig as TipTapNodeConfig,
  ExtensionConfig as TipTapExtensionConfig,
  Attribute as TiptapAttribute,
  Node,
  Extension
} from '@tiptap/core'

type GenericConfig = TipTapMarkConfig | TipTapNodeConfig | TipTapExtensionConfig
export type Attribute = Partial<TiptapAttribute>
export type AddAttributes<Config extends GenericConfig, Attributes> = (
  this: ThisParameterType<NonNullable<Config['addAttributes']>>
) => Record<keyof Attributes, Attribute>

export interface ExtensionMeta {
  name: string
  extensionType: 'mark' | 'block' | 'extension'
}

/**
 * Mark
 */
export interface MarkConfig<Options, Attributes, Storage> extends TipTapMarkConfig<Options, Storage> {
  addAttributes?: AddAttributes<TipTapMarkConfig, Attributes>
}

export const createMark = <
  Options = Record<string, any>,
  Attributes = Record<string, any>,
  Storage = Record<string, any>
>(
  config: MarkConfig<Options, Attributes, Storage>
): Mark<Options, Storage> => Mark.create(config)

/**
 * Block
 */
export interface BlockConfig<Options, Attributes, Storage> extends TipTapNodeConfig<Options, Storage> {
  addAttributes?: AddAttributes<TipTapNodeConfig, Attributes>
}

export const createBlock = <
  Options = Record<string, any>,
  Attributes = Record<string, any>,
  Storage = Record<string, any>
>(
  config: BlockConfig<Options, Attributes, Storage>
): Node<Options, Storage> => Node.create(config)

/**
 * Extension
 */
export interface ExtensionConfig<Options, Attributes, Storage> extends TipTapExtensionConfig<Options, Storage> {
  addAttributes?: AddAttributes<TipTapNodeConfig, Attributes>
}

export const createExtension = <
  Options = Record<string, any>,
  Attributes = Record<string, any>,
  Storage = Record<string, any>
>(
  config: ExtensionConfig<Options, Attributes, Storage>
): Extension<Options, Storage> => Extension.create(config)
