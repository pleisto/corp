import { Extension } from '@tiptap/core'
import { EditorView } from 'prosemirror-view'
import { Plugin, PluginKey } from 'prosemirror-state'
import { BrickdocEventBus, FormulaKeyboardEventTrigger } from '@brickdoc/schema'

export type KeyDownHandlerType = (view: EditorView<any>, event: KeyboardEvent) => boolean

const formulaHandleKeyDown: KeyDownHandlerType = (view, event) => {
  const key = event.key

  if (['Enter', 'Tab', 'ArrowUp', 'ArrowDown'].includes(key)) {
    BrickdocEventBus.dispatch(FormulaKeyboardEventTrigger({ key }))
    return true
  }

  return false
}

export const HandleKeyDownExtension = Extension.create({
  name: 'handleKeyDown',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('handleKeyDown'),
        props: {
          handleKeyDown: formulaHandleKeyDown
        }
      })
    ]
  }
})

