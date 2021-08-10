import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Table } from './Table'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    table: {
      /**
       * Set a table
       */
      setTable: () => ReturnType
    }
  }
}

export interface TableOptions {}

export const TableExtension = Node.create<TableOptions>({
  name: 'table',

  group: 'block',

  atom: true,

  selectable: false,

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
      setTable:
        () =>
        ({ commands }) => {
          return commands.replace(this.name)
        }
    }
  }
})
