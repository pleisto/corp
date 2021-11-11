import { Icon } from '@brickdoc/design-system'
import { NodeViewRendererProps } from '@tiptap/core'
import React from 'react'
import { useEditorI18n } from '../../..'
import { BlockWrapper } from '../../BlockWrapper'
import './PageLink.less'

export interface PageLinkProps extends NodeViewRendererProps {}

export const PageLink: React.FC<PageLinkProps> = ({ editor, node }) => {
  const [t] = useEditorI18n()
  return (
    <BlockWrapper as="span" editor={editor}>
      {!!node.attrs.icon && (
        <span role="img" className="brickdoc-page-link-block-icon" aria-label="">
          {node.attrs.icon}
        </span>
      )}
      {!node.attrs.icon && (
        <Icon.FilePages className="brickdoc-page-link-block-icon">
          <Icon.ArrowShortcut className="brickdoc-page-link-block-shortcut-arrow" />
        </Icon.FilePages>
      )}
      <span className="brickdoc-page-link-block-name">{node.attrs.name || t('page_link_block.untitled')}</span>
    </BlockWrapper>
  )
}
