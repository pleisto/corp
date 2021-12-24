import { Extension } from '@tiptap/core'
import { TextSelection, AllSelection, Transaction } from 'prosemirror-state'
import { isListType } from '../brickList'

export const clamp = (val: number, min: number, max: number) => {
  if (val < min) {
    return min
  }
  if (val > max) {
    return max
  }
  return val
}

const IndentProps = {
  min: 0,
  max: 210,

  more: 30,
  less: -30
}

function setNodeIndentMarkup(tr: Transaction, pos: number, delta: number) {
  if (!tr.doc) return tr

  const node = tr.doc.nodeAt(pos)
  if (!node) return tr

  const minIndent = IndentProps.min
  const maxIndent = IndentProps.max

  const indent = clamp(((node.attrs.indent as number) || 0) + delta, minIndent, maxIndent)

  if (indent === node.attrs.indent) return tr

  const nodeAttrs = {
    ...node.attrs,
    indent
  }

  return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks)
}

const updateIndentLevel = (tr: Transaction, delta: number) => {
  const { doc, selection } = tr

  if (!doc || !selection) return tr

  if (!(selection instanceof TextSelection || selection instanceof AllSelection)) {
    return tr
  }

  const { from, to } = selection

  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type

    if (nodeType.name === 'paragraph' || nodeType.name === 'heading') {
      setNodeIndentMarkup(tr, pos, delta)
      return false
    }
    if (isListType(nodeType)) {
      return false
    }
    return true
  })

  return tr
}

export interface IndentOptions {
  types: string[]
  indentLevels: number[]
  defaultIndentLevel: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType
      outdent: () => ReturnType
    }
  }
}

export const IndentExtension = Extension.create<IndentOptions>({
  name: 'indent',

  defaultOptions: {
    types: ['heading', 'paragraph'],
    indentLevels: [0, 30, 60, 90, 120, 150, 180, 210],
    defaultIndentLevel: 0
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: this.options.defaultIndentLevel,
            renderHTML: attributes => ({
              style: `margin-left: ${attributes.indent}px!important;`
            }),
            parseHTML: element => parseInt(element.style.marginLeft, 10) || this.options.defaultIndentLevel
          }
        }
      }
    ]
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch, editor }) => {
          const { selection } = state
          tr.setSelection(selection)
          updateIndentLevel(tr, IndentProps.more)

          if (tr.docChanged) {
            // eslint-disable-next-line no-unused-expressions
            dispatch?.(tr)
            return true
          }

          editor.chain().focus().run()

          return false
        },
      outdent:
        () =>
        ({ tr, state, dispatch, editor }) => {
          const { selection } = state
          tr.setSelection(selection)
          updateIndentLevel(tr, IndentProps.less)

          if (tr.docChanged) {
            // eslint-disable-next-line no-unused-expressions
            dispatch?.(tr)
            return true
          }

          editor.chain().focus().run()

          return false
        }
    }
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return this.editor.commands.indent()
      },
      'Shift-Tab': () => {
        return this.editor.commands.outdent()
      }
    }
  }
})
