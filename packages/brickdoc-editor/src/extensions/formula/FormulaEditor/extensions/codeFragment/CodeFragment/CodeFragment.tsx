import { NodeViewProps } from '@tiptap/core'
import { NodeViewWrapper } from '@tiptap/react'
import React from 'react'

export interface CodeFragmentProps extends NodeViewProps {}

export const CodeFragment: React.FC<CodeFragmentProps> = ({ editor, node }) => {
  console.log({ attrs: node.attrs })
  return (
    <NodeViewWrapper as="span">
      <span>code fragment</span>
    </NodeViewWrapper>
  )
}
