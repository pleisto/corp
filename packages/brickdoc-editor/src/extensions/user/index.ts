import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { User } from './User/User'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    userBlock: {
      /**
       * Set a user block
       */
      setUserBlock: () => ReturnType
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserBlockOptions {}

export const UserBlockExtension = Node.create<UserBlockOptions>({
  name: 'userBlock',

  inline: true,

  group: 'inline',

  selectable: false,

  defaultOptions: {},

  addAttributes() {
    return {
      name: {
        default: ''
      },
      avatar: {
        default: ''
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'user-block'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['user-block', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(User)
  },

  addCommands() {
    return {
      setUserBlock:
        () =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name })
        }
    }
  }
})
