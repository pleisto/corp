import { mergeAttributes, Content } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Embedtype } from '@brickdoc/schema'
import { EmbedBlock } from '../../../components'
import { createBlock } from '../../common'
import { meta } from './meta'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embed: {
      /**
       * Set an embedBlock
       */
      setEmbedBlock: (embedType: Embedtype, defaultFile?: File, postion?: number) => ReturnType
    }
  }
}

export interface EmbedOptions {}
export interface EmbedAttributes {
  embedMeta: {
    type: 'EmbedMeta'
  }
  isNew?: boolean
  defaultFile?: File | null
  link: {
    type: 'LINK'
  }
  image: {
    type: 'IMAGE'
  }
  attachment: {
    type: 'ATTACHMENT'
  }
}

export const Embed = createBlock<EmbedOptions, EmbedAttributes>({
  name: meta.name,

  group: 'block',

  selectable: false,

  draggable: true,

  allowGapCursor: false,

  addAttributes() {
    return {
      embedMeta: {
        default: {
          type: 'EmbedMeta'
        }
      },
      isNew: {
        default: false
      },
      defaultFile: {
        default: null
      },
      link: {
        default: {
          type: 'LINK'
        }
      },
      image: {
        default: {
          type: 'IMAGE'
        }
      },
      attachment: {
        default: {
          type: 'ATTACHMENT'
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'embed-block'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['embed-block', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedBlock)
  },

  addCommands() {
    return {
      setEmbedBlock:
        (embedType, defaultFile, position) =>
        ({ chain }) => {
          const content: Content = {
            type: this.name,
            attrs: {
              isNew: true,
              defaultFile,
              embedMeta: {
                embedType
              }
            }
          }
          return chain().insertBlockAt(content, position).run()
        }
    }
  }
})
