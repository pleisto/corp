import { BulletList as TiptapBulletList } from '@tiptap/extension-bullet-list'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ListBlock } from '../../../components'

export type { BulletListOptions } from '@tiptap/extension-bullet-list'
export interface BulletListAttributes {}

export const BulletList = TiptapBulletList.extend({
  draggable: true,
  addNodeView() {
    return ReactNodeViewRenderer(ListBlock)
  }
})
