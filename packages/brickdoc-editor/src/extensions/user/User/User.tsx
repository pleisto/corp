import React from 'react'
import { Avatar } from '@brickdoc/design-system'
import { NodeViewRendererProps } from '@tiptap/react'
import { BlockWrapper } from '../../BlockWrapper'
import './User.less'
import { useEditorI18n } from '../../..'

export interface UserProps extends NodeViewRendererProps {}

export const User: React.FC<UserProps> = ({ editor, node }) => {
  const [t] = useEditorI18n()
  return (
    <BlockWrapper as="span" editor={editor}>
      <Avatar src={node.attrs.avatar ?? ''} className="brickdoc-user-block-avatar" />
      <span className="brickdoc-user-block-name">{node.attrs.name || t('user_block.anonymous')}</span>
    </BlockWrapper>
  )
}
