import { Content, ExtensionAttribute } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { pasteImageHandler } from './pasteImageHandler'
import { gapClickHandler } from './gapClickHandler'
import { meta } from './meta'
import { createExtension } from '../../common'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    eventHandler: {
      insertBlockAt: (content: Content, position?: number) => ReturnType
    }
  }
}

export interface EventHandlerOptions {}
export interface EventHandlerAttributes {}

export const EventHandler = createExtension<EventHandlerOptions, ExtensionAttribute>({
  name: meta.name,

  addCommands() {
    return {
      insertBlockAt:
        (content, position) =>
        ({ chain }) => {
          return position === undefined
            ? chain().insertContent(content).run()
            : chain().insertContentAt(position, content).run()
        }
    }
  },

  addProseMirrorPlugins() {
    const editor = this.editor
    return [
      new Plugin({
        key: new PluginKey('eventHandler'),
        props: {
          handlePaste(view, event, slice): boolean {
            return pasteImageHandler(editor, event)
          },
          handleClick(view, pos, event) {
            gapClickHandler(editor, view, pos, event)
            return false
          }
        }
      })
    ]
  }
})
