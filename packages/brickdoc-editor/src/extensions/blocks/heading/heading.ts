import { Heading as TiptapHeading } from '@tiptap/extension-heading'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { HeadingBlock } from '../../../components'

export type { HeadingOptions } from '@tiptap/extension-heading'
export interface HeadingAttributes {}

export const Heading = TiptapHeading.extend({
  marks: 'bold italic link strike textStyle discussion',
  draggable: true,
  addNodeView() {
    return ReactNodeViewRenderer(HeadingBlock)
  }
})
