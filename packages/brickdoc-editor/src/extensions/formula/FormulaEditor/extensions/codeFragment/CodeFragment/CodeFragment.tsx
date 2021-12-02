import React from 'react'
import { NodeViewProps } from '@tiptap/core'
import { NodeViewWrapper } from '@tiptap/react'
import { CodeFragment as CodeFragmentType } from '@brickdoc/formula'
import { StringLiteral } from '../CodeFragment/StringLiteral/StringLiteral'
import { NumberLiteral } from '../CodeFragment/NumberLiteral/NumberLiteral'

export interface CodeFragmentProps extends NodeViewProps {}

const renderContent = (codeFragment: CodeFragmentType, content: string): React.ReactElement => {
  switch (codeFragment.code) {
    case 'StringLiteral':
      return <StringLiteral content={content} />
    case 'NumberLiteral':
      return <NumberLiteral content={content} />
    default:
      return <span>{content}</span>
  }
}

export const CodeFragment: React.FC<CodeFragmentProps> = ({ editor, node }) => {
  const codeFragment = node.attrs as CodeFragmentType
  const text = codeFragment.space ? ` ${codeFragment.name} ` : codeFragment.name

  return <NodeViewWrapper as="span">{renderContent(codeFragment, text)}</NodeViewWrapper>
}
