import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { PageLink } from './PageLink/PageLink'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageLinkBlock: {
      /**
       * Set a page link block
       */
      setPageLinkBlock: () => ReturnType
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PageLinkBlockOptions {}

export const PageLinkBlockExtension = Node.create<PageLinkBlockOptions>({
  name: 'pageLinkBlock',

  inline: true,

  group: 'inline',

  selectable: false,

  defaultOptions: {},

  addAttributes() {
    return {
      name: {
        default: ''
      },
      icon: {
        default: ''
      },
      link: {
        default: ''
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'page-link-block'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['user-block', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(PageLink)
  },

  addCommands() {
    return {
      setPageLinkBlock:
        () =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name })
        }
    }
  }
})
