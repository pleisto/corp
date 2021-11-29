import { NodeViewProps } from '@tiptap/core'
import { NodeViewWrapper } from '@tiptap/react'
import React from 'react'

export interface FunctionCallProps extends NodeViewProps {}

export const FunctionCall: React.FC<FunctionCallProps> = ({ editor }) => {
  return (
    <NodeViewWrapper as="span">
      <span>function call</span>
    </NodeViewWrapper>
  )
}
