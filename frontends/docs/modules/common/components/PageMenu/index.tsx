import React from 'react'

import { Dropdown, Menu } from '@brickdoc/design-system'
import { Link } from 'react-router-dom'
import { useDocsI18n } from '../../hooks'
import { useBlockDeleteMutation, BlockDeleteInput } from '@/BrickdocGraphQL'

interface PageMenuProps {
  webid: string
  id: string
  title: string
  parentId: string
}

const PageMenu: React.FC<PageMenuProps> = props => {
  const [blockDelete] = useBlockDeleteMutation()
  const deletePage = id => {
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
