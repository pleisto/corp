import { mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { SubPageMenuBlock } from '../../../components'
import { createBlock } from '../../common'
import { meta } from './meta'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    subPageMenu: {
      /**
       * Set a subPage menu block
       */
      setSubPageMenuBlock: (position?: number) => ReturnType
    }
  }
}

export interface SubPageMenuOptions {}
export interface SubPageMenuAttributes {}

export const SubPageMenu = createBlock<SubPageMenuOptions, SubPageMenuAttributes>({
  name: meta.name,

  group: 'block',

  selectable: false,

  draggable: true,

  allowGapCursor: false,

  parseHTML() {
    return [
      {
        tag: 'sub-page-menu-block'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['sub-page-menu-block', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(SubPageMenuBlock)
  },

  addCommands() {
    return {
      setSubPageMenuBlock:
        position =>
        ({ chain }) => {
          return chain().insertBlockAt({ type: this.name }, position).run()
        }
    }
  }
})
