import { Extension, findParentNode, getNodeType } from '@tiptap/core'
import { joinBackward as originalJoinBackward } from 'prosemirror-commands'
import { Selection } from 'prosemirror-state'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface brickListOptions {}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    brickList: {
      wrapInBrickList: (listType: string) => ReturnType
      joinBackward: () => ReturnType
    }
  }
}

export const brickListExtension = Extension.create<brickListOptions>({
  name: 'brickList',
  addCommands() {
    return {
      wrapInBrickList:
        listType =>
        ({ commands }) => {
          return commands.wrapInList(listType)
        },
      joinBackward:
        () =>
        ({ editor, state, tr, dispatch }) => {
          const itemType = getNodeType('listItem', state.schema)
          const { selection } = state

          const curNode = selection.$from.parent
          if (curNode.content.size === 0) {
            const listItem = findParentNode(node => node.type === itemType)(selection)
            if (listItem) {
              const listItemNode = listItem.node
              if (listItemNode.textContent.length === 0) {
                let deleteFrom = listItem.pos - 2
                if (deleteFrom < 0) deleteFrom = 0
                tr.delete(deleteFrom, listItem.start + listItemNode.nodeSize)
                // console.log(listItem)
                // console.log(selection.$from.nodeBefore)
                console.log(listItem.pos)
                const selection = Selection.findFrom(tr.doc.resolve(tr.mapping.map(listItem.pos, -1)), -1)
                if (selection) tr.setSelection(selection)
                if (dispatch) dispatch(tr.scrollIntoView())
                return true
              }
            }
          }
          return originalJoinBackward(state, dispatch)
        }
    }
  }
})
