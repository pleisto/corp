import { Node } from 'prosemirror-model'
import { useCallback, useMemo } from 'react'
import { EditorOptions, EmbedOptions, Y } from '@brickdoc/editor'
import { useGetSpaceMembersQuery } from '@/BrickdocGraphQL'
import { useReactiveVar } from '@apollo/client'
import { pagesVar } from '@/docs/reactiveVars'
import { Block } from '@brickdoc/schema'
import { DocMeta } from '@/docs/store/DocMeta'

export interface UseEditorOptions {
  docMeta: DocMeta
  blocks: Block[]
  documentEditable: boolean
  ydoc: Y.Doc | undefined
  onDocSave: (doc: Node) => Promise<void>
}

export function useEditorOptions({
  docMeta,
  documentEditable,
  blocks,
  ydoc,
  onDocSave
}: UseEditorOptions): EditorOptions {
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

  const blobs = useMemo(
    () =>
      blocks?.reduce<{
        [blockKey: string]: Array<{
          key: string
          url: string
        }>
      }>((prev, cur) => {
        return {
          ...prev,
          [cur.rootId ?? cur.id]: [
            ...(prev[cur.rootId ?? cur.id] ?? []),
            ...(cur.blobs?.map(blob => ({
              key: blob.blobKey,
              url: blob.url
            })) ?? [])
          ]
        }
      }, {}) ?? {},
    [blocks]
  )

  const getFileUrl = useCallback<NonNullable<EmbedOptions['getFileUrl']>>(
    (key, source): string | undefined => {
      if (source === 'EXTERNAL') return key
      if (!docMeta.id) return undefined
      if (source === 'ORIGIN') return blobs[docMeta.id]?.find(blob => blob.key === key)?.url
      return undefined
    },
    [blobs, docMeta.id]
  )

  return {
    base: {
      collaboration: ydoc
        ? {
            document: ydoc
          }
        : false,
      embed: {
        getFileUrl
      },
      mentionCommands: {
        pages,
        users
      },
      sync: {
        onSave: onDocSave
      }
    },
    editable: documentEditable
  }
}
