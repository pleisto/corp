import { Editor, Extension, findParentNode, getNodeType, isList } from '@tiptap/core'
import { joinBackward as originalJoinBackward, liftEmptyBlock as originalLiftEmptyBlock } from 'prosemirror-commands'
import { NodeType } from 'prosemirror-model'
import { liftListItem as originalLiftListItem } from 'prosemirror-schema-list'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface brickListOptions {}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    brickList: {
      wrapInBrickList: (listType: string) => ReturnType
      joinBackward: () => ReturnType
      liftEmptyBlock: () => ReturnType
    }
  }
}

export const isListType = (nameOrType: string | NodeType) => (editor: Editor) => {
  const { extensions } = editor.extensionManager
  const { state } = editor
  const itemType = getNodeType(nameOrType, state.schema)
  const { selection } = state
  const parentList = findParentNode(node => isList(node.type.name, extensions))(selection)
  return parentList ? parentList.node.type === itemType : false
}

export const isAnyListType = (editor: Editor): boolean =>
  isListType('bulletList')(editor) || isListType('orderedList')(editor)

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
        ({ editor, commands, state, tr, dispatch }) => {
          const { selection } = state
          const itemType = getNodeType('listItem', state.schema)
          const listItem = findParentNode(node => node.type === itemType)(selection)
          const prevText = state.doc.textBetween(selection.$from.before(), selection.$from.pos)
          if (prevText.length === 0) {
            if (listItem) {
              return originalLiftListItem(itemType)(state, dispatch)
            } else {
              const prevNode = tr.doc.resolve(selection.$from.before() - 1).parent
              if (prevNode.type.name.endsWith('List')) {
                throw new Error('for the right backward.')
              }
            }
          }
          return originalJoinBackward(state, dispatch)
        },
      liftEmptyBlock:
        () =>
        ({ state, dispatch }) => {
          return originalLiftEmptyBlock(state, dispatch)
        }
    }
  }
})
