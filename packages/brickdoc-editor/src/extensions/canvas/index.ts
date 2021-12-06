import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { CanvasBlock } from './CanvasBlock'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CanvasOptions {}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    canvas: {
      setFormula: (id: string, position?: number) => ReturnType
      setCanvasBlock: (position: number) => ReturnType
    }
  }
}

export const CanvasExtension = Node.create<CanvasOptions>({
  name: 'canvasBlock',

  group: 'inline',

  inline: true,

  atom: true,

  selectable: false,

  addAttributes() {
    return {
      isNew: {
        default: false
      },
      formula: {
        default: {
          type: 'FORMULA',
          color: ''
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'canvas-block'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['canvas-block', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CanvasBlock)
  },

  addCommands() {
    return {
      setFormula:
        (id, position) =>
        ({ commands }) => {
          const content = { type: this.name, attrs: { formula: { type: 'FORMULA', id } } }
          if (position) return commands.insertContentAt(position, content)
          return commands.insertContent(content)
        },
      setCanvasBlock:
        (position: number) =>
        ({ commands }) => {
          return commands.insertContentAt(position, { type: this.name, attrs: { isNew: true, formula: { type: 'FORMULA' } } })
        }
    }
  }
})
