import { Node, mergeAttributes, JSONContent } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { SetDocAttrStep } from '../../../../sync/SetDocAttrStep'
import { FunctionCall } from './FunctionCall/FunctionCall'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    functionCallBlock: {
      setFunctionCallBlock: () => ReturnType
      setDocAttrs: (newAttrs: Record<string, any>) => ReturnType
      replaceRoot: (content: JSONContent) => ReturnType
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
    return {
      functionCall: {
        default: {
          code: '',
          name: '',
          space: false,
          type: 'any',
          errors: []
        }
      }
    }
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
        },
      setDocAttrs:
        newAttrs =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            tr.step(new SetDocAttrStep(newAttrs))
          }
          return true
        },
      replaceRoot:
        content =>
        ({ chain, can, dispatch }) => {
          const chainedCommands = dispatch ? chain() : can().chain()
          return (
            chainedCommands
              // replaceRoot will not record in history because it is an initialization
              .setMeta('addToHistory', false)
              .setContent(content, false)
              .setDocAttrs(content.attrs ?? {})
              .run()
          )
        }
    }
  }
})
