import { DocMeta } from '@/docs/store/DocMeta'
import { Block } from '@brickdoc/schema'
import { BaseOptions } from '@brickdoc/editor'
import { useGetGalleryImages } from './useGetGalleryImages'
import { useGetUrlData } from './useGetUrlData'
import { useGetFileUrl } from './useGetFileUrl'

export function useEmbed(blocks: Block[], docMeta: DocMeta): BaseOptions['embed'] {
  const getFileUrl = useGetFileUrl(blocks, docMeta)
  const getGalleryImages = useGetGalleryImages()
  const getUrlData = useGetUrlData()

  return {
    getFileUrl,
    getGalleryImages,
    getUrlData
  }
}
