import { v4 as uuid } from 'uuid'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Table } from './Table'
import { DatabaseRows } from './Table/useRows'

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

export interface TableExtensionOptions {
  getDatabaseRows: (parentId: string, snapshotVersion: number) => Promise<DatabaseRows>
  saveDatabaseRow: (block: { parentId: string; id: string; data: {}; sort: number }) => Promise<void>
}

export interface TableBlockOptions {
  getDatabaseRows: TableExtensionOptions['getDatabaseRows']
  saveDatabaseRow: TableExtensionOptions['saveDatabaseRow']
}

export const TableBlockExtension = Node.create<TableBlockOptions>({
  name: 'tableBlock',

  group: 'block',

  selectable: false,

  defaultOptions: {
    getDatabaseRows: () => {
      throw new Error('You need configure getDatabaseRows if you want to enable tableBlock')
    },
    saveDatabaseRow: () => {
      throw new Error('You need configure saveDatabaseRow if you want to enable tableBlock')
    }
  },

  addAttributes() {
    return {
      data: {
        default: {
          columns: [
            {
              title: 'Task name',
              type: 'text',
              key: uuid()
            }
          ]
        }
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
