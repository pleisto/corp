import { v4 as uuid } from 'uuid'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Table, DEFAULT_GROUP_ID } from './Table'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableBlock: {
      /**
       * Set a table block
       */
      setTableBlock: () => ReturnType
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableBlockOptions {}

export const TableBlockExtension = Node.create<TableBlockOptions>({
  name: 'tableBlock',

  group: 'block',

  selectable: false,

  addAttributes() {
    return {
      columns: {
        default: [
          {
            title: 'Task name',
            type: 'text',
            key: uuid(),
            group: DEFAULT_GROUP_ID
          }
        ]
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'table-block'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['table-block', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(Table)
  },

  addCommands() {
    return {
      setTableBlock:
        () =>
        ({ commands }) => {
          return commands.replace(this.name)
        }
    }
  }
})
