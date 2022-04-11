import { Input, theme } from '@brickdoc/design-system'
import React, { useState } from 'react'
import { useDocsI18n } from '../../hooks'
import { PageTrash } from './TrashList'
import * as Root from './Trash.style'

interface TrashTableProps {
  docMeta: {
    id?: string | undefined
    domain: string
  }
}

export const TrashTable: React.FC<TrashTableProps> = ({ docMeta }) => {
  const [keyword, setSearchKeyword] = useState<string>('')
  const { t } = useDocsI18n()

  return (
    <Root.PageContainer>
      <Root.Title>
        <h1>{t('trash.name')}</h1>
        <Input
          css={{ width: 368, height: 32, background: theme.colors.ceramicQuaternary }}
          placeholder={t('trash.search')}
          suffix={<Root.InputSuffix>⌘+P</Root.InputSuffix>}
          onChange={e => setSearchKeyword(e.target.value)}
        />
      </Root.Title>
      <PageTrash domain={docMeta.domain} keyword={keyword} />
    </Root.PageContainer>
  )
}
