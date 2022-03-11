import { OrderedList as TiptapOrderedList } from '@tiptap/extension-ordered-list'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ListBlock } from '../../../components'

export type { OrderedListOptions } from '@tiptap/extension-ordered-list'
export interface OrderedListAttributes {}

export const OrderedList = TiptapOrderedList.extend({
  draggable: true,
  addNodeView() {
    return ReactNodeViewRenderer(ListBlock)
  }
})
