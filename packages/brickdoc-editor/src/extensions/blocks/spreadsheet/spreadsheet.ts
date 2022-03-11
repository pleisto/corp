import { mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { v4 as uuid } from 'uuid'
import { Spreadsheet as SpreadsheetBlock } from '../../../components'
import { createBlock } from '../../common'
import { meta } from './meta'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    spreadsheetBlock: {
      /**
       * Set a spreadsheet block
       */
      setSpreadsheetBlock: (position?: number) => ReturnType
    }
  }
}

export interface SpreadsheetOptions {}
export interface SpreadsheetAttributes {
  // TODO: add attributes types
}

export const Spreadsheet = createBlock<SpreadsheetOptions, SpreadsheetAttributes>({
  name: meta.name,

  group: 'block',

  selectable: false,

  atom: true,

  draggable: true,

  allowGapCursor: false,

  addAttributes() {
    return {
      isNew: {
        default: false
      },
      data: {
        default: {
          columns: [],
          rowsCount: 0
        }
      },
      title: {
        default: ''
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'spreadsheet-block'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['spreadsheet-block', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(SpreadsheetBlock)
  },

  addCommands() {
    return {
      setSpreadsheetBlock:
        (position?: number) =>
        ({ chain }) => {
          return chain()
            .insertBlockAt(
              {
                type: this.name,
                attrs: {
                  isNew: true,
                  data: {
                    columns: [
                      { uuid: uuid(), sort: 0 },
                      { uuid: uuid(), sort: 1 }
                    ],
                    rowCount: 0
                  }
                }
              },
              position
            )
            .run()
        }
    }
  }
})
