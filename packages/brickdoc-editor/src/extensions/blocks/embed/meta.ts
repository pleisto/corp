import { Embedtype } from '@brickdoc/schema'
import { BlockViewProps, ExtensionMeta } from '../../common'

export const meta: ExtensionMeta = {
  name: 'embedBlock',
  extensionType: 'block'
}

export interface GalleryImage {
  id: string
  width: number
  height: number
  fullUrl: string
  smallUrl: string
  username: string
  blurHash: string
}

export interface EmbedOptions {
  getFileUrl?: (key: string, source: 'EXTERNAL' | 'ORIGIN') => string | undefined | null
  getGalleryImages?: (options: {
    query?: string
    page: number
    perPage: number
  }) => Promise<{ success: boolean; data: GalleryImage[] }>
}

export type EmbedViewMode = 'text' | 'preview' | 'card'
export interface EmbedAttributes {
  embedMeta: {
    type: 'EmbedMeta'
    embedType: Embedtype
  }
  defaultFile?: File | null
  link: {
    type: 'LINK'
    key?: string
    title?: string | null
    displayName?: string | null
    description?: string | null
    cover?: string | null
    icon?: string | null
    mode?: EmbedViewMode
  }
  image: {
    type: 'IMAGE'
    name?: string
    key?: string
    viewUrl?: string
    displayName?: string | null
    source?: 'EXTERNAL' | 'ORIGIN'
    mode?: EmbedViewMode
    size?: number
    height?: number
    width?: number
    ratio?: number
    align?: 'left' | 'right' | 'center' | 'full-width'
  }
  attachment: {
    name?: string
    displayName?: string | null
    key?: string
    viewUrl?: string
    contentType?: string | null
    type: 'ATTACHMENT'
    source?: 'EXTERNAL' | 'ORIGIN'
    mode?: EmbedViewMode
    size?: number
  }
}

export interface EmbedViewProps extends BlockViewProps<EmbedOptions, EmbedAttributes> {}
