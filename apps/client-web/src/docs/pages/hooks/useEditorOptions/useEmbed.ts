import { DocMeta } from '@/docs/store/DocMeta'
import { Block } from '@brickdoc/schema'
import { EmbedOptions, BaseOptions } from '@brickdoc/editor'
import { useMemo, useCallback } from 'react'
import { useGetGalleryImages } from './useGetGalleryImages'

export function useEmbed(blocks: Block[], docMeta: DocMeta): BaseOptions['embed'] {
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

  const getGalleryImages = useGetGalleryImages()

  return {
    getFileUrl,
    getGalleryImages
  }
}
