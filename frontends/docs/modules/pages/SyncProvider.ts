import { SyncCallback } from 'packages/brickdoc-editor/src/extensions'
import type { Node } from 'prosemirror-model'
import { BlockSyncInput, PageBlockData, TextBlockData } from '@/BrickdocGraphQL'

// https://prosemirror.net/docs/ref/#model.Node
const nodeToBlocks = (node: Node): BlockSyncInput[] => {
  const parent: BlockSyncInput = {
    id: (node as any).uuid,
    sort: (node as any).sort,
    type: node.type.name,
    meta: { attrs: JSON.stringify(node.attrs), marks: JSON.stringify(node.marks.map(n => n.toJSON())) }
  }

  switch (node.type.name) {
    case 'doc':
      ;(parent.data as PageBlockData) = { title: `[title] ${(node as any).uuid}` }
      break
    case 'text':
      ;(parent.data as TextBlockData) = { content: node.text }
      break
    default:
      ;(parent.data as any) = {}
      break
  }

  // NOTE Fragment type miss content field
  const fragment: any = node.content
  const children = fragment.content.flatMap((n: Node) =>
    nodeToBlocks(n).map((i: BlockSyncInput) => {
      return { ...i, parentId: parent.id }
    })
  )

  return [parent, ...children]
}

export const syncProvider = (blockSync): SyncCallback => {
  return {
    onCommit: node => {
      console.log(node)
      const inputs = nodeToBlocks(node)
      console.log(inputs)
      inputs.map(input => blockSync({ variables: { input } }))
    }
  }
}
