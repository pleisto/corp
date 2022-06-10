import { useGetSpaceMembersQuery } from '@/BrickdocGraphQL'
import { pagesVar } from '@/docs/reactiveVars'
import { DocMeta } from '@/docs/store/DocMeta'
import { useReactiveVar } from '@apollo/client'
import { BaseOptions } from '@brickdoc/editor'
import { useMemo } from 'react'

export function useMentionCommands(docMeta: DocMeta): BaseOptions['mentionCommands'] {
  const { data } = useGetSpaceMembersQuery()

  const users = useMemo(
    () =>
      data?.spaceMembers?.map(member => ({
        id: member.domain,
        name: member.name,
        avatar: member.avatarData?.url ?? ''
      })) ?? [],
    [data?.spaceMembers]
  )

  const pages = useReactiveVar(pagesVar).map(item => ({
    id: item.key,
    icon: item.icon,
    link: `/${docMeta.domain}/${item.key}`,
    parentId: item.parentId,
    title: item.title
  }))

  return {
    users,
    pages
  }
}
