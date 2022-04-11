import { Block, GetTrashBlocksQueryVariables, useGetTrashBlocksQuery } from '@/BrickdocGraphQL'
import { Spin, useList, Checkbox, Button, theme } from '@brickdoc/design-system'
import React from 'react'
import { useDocsI18n } from '../../hooks'
import { TrashItem } from './TrashItem'
import { Table, Delete, Undo } from '@brickdoc/design-icons'
import { List, Item, NotFound, Page, Owner, Time, Action, SelectBlock, SelectedBar } from './Trash.style'

interface PageTrashProps {
  domain: string
  keyword: string | undefined
}

export interface BlockWithChecked extends Block {
  checked?: boolean
}

export const PageTrash: React.FC<PageTrashProps> = ({ domain, keyword }) => {
  const { t } = useDocsI18n()
  const { list, getKey, addList, resetList, replace } = useList<BlockWithChecked>()

  const input: GetTrashBlocksQueryVariables = React.useMemo(
    () => ({
      domain,
      search: keyword
    }),
    [keyword, domain]
  )

  const { data, loading } = useGetTrashBlocksQuery({ variables: input })
  React.useEffect(() => {
    resetList([])
    addList(data?.trashBlocks as BlockWithChecked[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (loading) {
    return <Spin size="lg" />
  }

  if (!data?.trashBlocks?.length) {
    return <NotFound>{t('trash.not_found')}</NotFound>
  }

  const onChange = (index: number) => (checked: boolean) => {
    const item = { ...list[index] }
    item.checked = checked
    replace(index, item)
  }
  const selectedNum = list.filter(item => item.checked).length
  const indeterminate = selectedNum !== list.length

  const handleClick = (): void => {
    const nextList = list.map(item => {
      return {
        ...item,
        checked: indeterminate
      }
    })
    resetList(nextList)
  }

  return (
    <List>
      <Item type="title" key="title">
        <Page>Pages</Page>
        <Owner>Owner</Owner>
        <Time>Remaining time</Time>
        <Action>
          <Table />
        </Action>
      </Item>
      {list.map((item: Block, index: number) => (
        <Item type="item" key={getKey(index)}>
          <TrashItem domain={domain} block={item} onChange={onChange(index)} />
        </Item>
      ))}
      <SelectedBar>
        <Page>
          <SelectBlock checked>
            <Checkbox
              onClick={handleClick}
              checked
              noLabel
              style={{ background: theme.colors.white.value }}
              indeterminate={indeterminate}
            />
          </SelectBlock>
          <span>
            {t('trash.selected')} {selectedNum}
          </span>
        </Page>
        <Action>
          <Button style={{ marginRight: '0.5rem' }} icon={<Undo />}>
            {t('trash.restore_action')}
          </Button>
          <Button icon={<Delete />} type="danger">
            {t('trash.hard_delete_action')}
          </Button>
        </Action>
      </SelectedBar>
    </List>
  )
}
