import React from 'react'

import { Dropdown, Menu } from '@brickdoc/design-system'
import { Link } from 'react-router-dom'
import { useDocsI18n } from '../../hooks'
import { useBlockDeleteMutation, BlockDeleteInput, Scalars } from '@/BrickdocGraphQL'

interface PageMenuProps {
  webid: string
  id: Scalars['UUID']
  title: Scalars['String']
  parentId: Scalars['UUID'] | null
}

const PageMenu: React.FC<PageMenuProps> = props => {
  const [blockDelete] = useBlockDeleteMutation()
  const deletePage = (id: Scalars['UUID']) => {
    const input: BlockDeleteInput = { id }
    blockDelete({ variables: { input } })
  }
  const { t } = useDocsI18n()

  const link = <Link to={`/${props.webid}/${props.id}`}>{props.title}</Link>
  if (props.parentId) {
    return link
  }
  const menu = (
    <Menu onClick={e => deletePage(props.id)}>
      <Menu.Item key="create_snapshot">{t('blocks.create_snapshot')}</Menu.Item>
      <Menu.Divider />
      <Menu.Item danger key="delete">
        {t('blocks.delete')}
      </Menu.Item>
    </Menu>
  )
  return (
    <Dropdown mouseEnterDelay={1} overlay={menu}>
      {link}
    </Dropdown>
  )
}

export default PageMenu
