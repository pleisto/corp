import React from 'react'
import { useGetPageBlocksQuery, useBlockMoveMutation, BlockMoveInput, BlockData } from '@/BrickdocGraphQL'
import { Skeleton, Tree } from '@brickdoc/design-system'
import { array2Tree } from '@/utils'
import { PageMenu } from '../PageMenu'

interface PageTreeProps {
  webid: string
}

export const PageTree: React.FC<PageTreeProps> = ({ webid }) => {
  const { data, loading, refetch } = useGetPageBlocksQuery({ variables: { webid } })
  const [blockMove, { loading: moveLoading }] = useBlockMoveMutation()

  if (loading || moveLoading || !data?.pageBlocks) {
    return <Skeleton />
  }

  const flattedData = data.pageBlocks
    .map(i => {
      const data: BlockData = i.data
      const title = data.text.slice(0, 20)
      return {
        key: i.id,
        value: i.id,
        parentId: i.parentId,
        type: i.type,
        sort: i.sort,
        nextSort: i.nextSort,
        titleText: title,
        title: <PageMenu id={i.id} text={data.text} parentId={i.parentId ?? null} title={title} webid={webid} />
      }
    })
    .sort((a, b) => Number(a.sort) - Number(b.sort))

  const onDrop = async (attrs: any): Promise<void> => {
    // TODO check dropToGap
    // TODO empty targetParentId support
    console.log(attrs)
    let targetParentId: string, sort: number
    // Check if is root node
    if (attrs.node.parentId) {
      targetParentId = attrs.node.parentId
      // take averaged value
      sort = Math.round(0.5 * (Number(attrs.node.sort) + Number(attrs.node.nextSort)))
    } else {
      targetParentId = attrs.node.key
      // take next value
      sort = Number(attrs.node.nextSort)
    }
    const input: BlockMoveInput = { id: attrs.dragNode.key, targetParentId, sort }
    console.log({ input })
    await blockMove({ variables: { input } })
    void refetch()
  }

  const compactedData = flattedData.filter(i => {
    // NOTE check if is NEWLINE (which type == paragraph and title is blank)
    return i.type !== 'paragraph' || !!i.titleText
  })

  const treeData = array2Tree(compactedData, { id: 'key' })

  return <Tree treeData={treeData as any} defaultExpandAll draggable onDrop={onDrop} />
}
