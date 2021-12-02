import { NodeViewProps } from '@tiptap/core'
import { NodeViewWrapper } from '@tiptap/react'
import React from 'react'
import { CodeFragment as CodeFragmentType } from '@brickdoc/formula'

export interface CodeFragmentProps extends NodeViewProps {}

export const CodeFragment: React.FC<CodeFragmentProps> = ({ editor, node }) => {
  const codeFragment = node.attrs as CodeFragmentType
  const text = codeFragment.space ? ` ${codeFragment.name} ` : codeFragment.name
  console.log({ codeFragment, text })

  return (
    <NodeViewWrapper as="span">
      <span>{text}</span>
    </NodeViewWrapper>
  )
}
