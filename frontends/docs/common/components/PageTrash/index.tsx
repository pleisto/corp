import { Block, useGetTrashBlocksQuery } from '@/BrickdocGraphQL'
import { DeprecatedSkeleton, useList } from '@brickdoc/design-system'
import React, { useEffect } from 'react'
import { useDocsI18n } from '../../hooks'
import { BlockListItem } from '../BlockListItem'
import { List, Item, NotFound } from './PageTrash.style'

interface PageTrashProps {
  webid: string
  docid: string | null
  search: string | undefined
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export const PageTrash: React.FC<PageTrashProps> = ({ webid, docid, search, setVisible }) => {
  const { t } = useDocsI18n()
  const { list, getKey, addList } = useList<Block>()

  const input: any = { webid }
  if (docid) {
    input.blockId = docid
  }
  if (search) {
    input.search = search
  }
  const { data, loading } = useGetTrashBlocksQuery({ variables: input })
  useEffect(() => {
    addList(data?.trashBlocks as Block[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (loading) {
    return <DeprecatedSkeleton active />
  }

  if (!data?.trashBlocks?.length) {
    return <NotFound>{t('trash.not_found')}</NotFound>
  }

  return (
    <List>
      {list.map((item: Block, index: number) => (
        <Item key={getKey(index)}>
          <BlockListItem webid={webid} block={item} setVisible={setVisible} />
        </Item>
      ))}
    </List>
  )
}
