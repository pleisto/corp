import { Paragraph as TiptapParagraph } from '@tiptap/extension-paragraph'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ParagraphBlock } from '../../../components'

export type { ParagraphOptions } from '@tiptap/extension-paragraph'
export interface ParagraphAttributes {}

export const Paragraph = TiptapParagraph.extend({
  draggable: true,
  addNodeView() {
    return ReactNodeViewRenderer(ParagraphBlock)
  }
})
