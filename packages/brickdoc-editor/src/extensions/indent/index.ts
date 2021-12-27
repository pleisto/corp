import { Extension } from '@tiptap/core'
import { isListType } from '../brickList'
import { ExtensionBaseOptions } from '../baseOptions'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType
    }
  }
}

export const IndentExtension = Extension.create<ExtensionBaseOptions>({
  name: 'indent',

  addCommands() {
    return {
      indent:
        () =>
        ({ editor, tr, state, dispatch }) => {
          const isList = isListType('bulletList')(editor) || isListType('orderedList')(editor)
          if (isList) {
            return false
          }
          tr.insertText('\t')
          if (tr.docChanged) {
            // eslint-disable-next-line no-unused-expressions
            dispatch?.(tr)?.scrollIntoView()
            return true
          }
          return false
        }
    }
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent()
    }
  }
})
