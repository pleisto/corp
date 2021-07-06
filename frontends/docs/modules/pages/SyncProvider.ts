import { SyncCallback } from 'packages/brickdoc-editor/src/extensions'
import { Node } from 'prosemirror-model'
import { BlockSyncInput, PageBlockData, TextBlockData, ParagraphBlockData, Block, BlockSyncBatchInput } from '@/BrickdocGraphQL'
import { JSONContent } from '@tiptap/core'

const SLICE_MAX_SIZE = 50

const outline = (node: Node): string => {
  return (node.textContent || 'untitled').slice(0, SLICE_MAX_SIZE)
}

// https://prosemirror.net/docs/ref/#model.Node
const nodeToBlock = (node: Node): BlockSyncInput[] => {
  const { uuid, sort, ...rest } = node.attrs
  const parent: BlockSyncInput = {
    id: node.attrs.uuid,
    // sort: node.attrs.sort, ## TODO
    type: node.type.name,
    meta: { attrs: JSON.stringify(rest), marks: JSON.stringify(node.marks.map(n => n.toJSON())) }
  }

  switch (node.type.name) {
    case 'doc':
      ;(parent.data as PageBlockData) = { title: outline(node) }
      break
    case 'paragraph':
      ;(parent.data as ParagraphBlockData) = { title: outline(node) }
      break
    case 'text':
      ;(parent.data as TextBlockData) = { content: node.text }
      break
    default:
      console.table(node)
      ;(parent.data as any) = {}
      break
  }

  // NOTE Fragment type miss content field
  const fragment: any = node.content
  const children = fragment.content.flatMap((n: Node, index) =>
    nodeToBlock(n).map((i: BlockSyncInput) => {
      return { parentId: parent.id, sort: index, ...i }
    })
  )

  return [parent, ...children]
}

export const blockToNode = (block: Block): JSONContent => {
  const result: any = {}
  result.type = block.type

  if (block.type === 'text') {
    result.text = `uuid$$$$${block.id}sort$$$$${block.sort}####${(block.data as TextBlockData).content}`
  }

  const meta = block.meta as any

  if (meta?.marks) {
    result.marks = JSON.parse(meta.marks)
  }

  if (meta?.attrs) {
    result.attrs = JSON.parse(meta.attrs)
  } else {
    result.attrs = {}
  }

  result.attrs.uuid = block.id
  result.attrs.sort = block.sort

  return result
}

export const nest = (blocks: Block[], id = null): JSONContent[] =>
  blocks
    .filter(block => block.parentId === id)
    .sort((a, b) => a.sort - b.sort)
    .map(block => ({ content: nest(blocks, block.id), ...blockToNode(block) }))

export const syncProvider = ({ blockSyncBatch }): SyncCallback => {
  return {
    onCommit: ({ node }) => {
      const blocks = nodeToBlock(node)
      const input: BlockSyncBatchInput = { blocks, rootId: node.attrs.uuid }
      blockSyncBatch({ variables: { input } })
    }
  }
}
