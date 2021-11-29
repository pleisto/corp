import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { FunctionCall } from './FunctionCall/FunctionCall'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    functionCallBlock: {
      setFunctionCallBlock: () => ReturnType
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FunctionCallBlockOptions {}

export const FunctionCallBlockExtension = Node.create<FunctionCallBlockOptions>({
  name: 'functionCallBlock',

  inline: true,

  group: 'inline',

  selectable: false,

  defaultOptions: {},

  addAttributes() {
    return {}
  },

  parseHTML() {
    return [
      {
        tag: 'function-call'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['function-call', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FunctionCall)
  },

  addCommands() {
    return {
      setFunctionCallBlock:
        () =>
        ({ chain }) => {
          return chain().insertContent(this.name).run()
        }
    }
  }
})
