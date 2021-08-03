import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Skeleton } from '@brickdoc/design-system'
import { EditorContent, ImageSectionAttributes, useEditor } from '@brickdoc/editor'
import { useBlockSyncBatchMutation, useGetChildrenBlocksQuery, Block, Filestoragetype, BlockMeta } from '@/BrickdocGraphQL'
import { DocumentTitle } from './DocumentTitle'
import { syncProvider, blocksToJSONContents } from './SyncProvider'
import { useDocumentSubscription } from './useDocumentSubscription'
import { usePrepareFileUpload } from './usePrepareFileUpload'
import { useFetchUnsplashImages } from './useFetchUnsplashImages'
import styles from './DocumentPage.module.less'
import { DocumentIconMeta } from './DocumentTitle/DocumentIcon'
import { DocumentCoverMeta } from './DocumentTitle/DocumentCover'
import { JSONContent } from '@tiptap/core'

interface DocumentMeta {
  icon?: DocumentIconMeta | null
  cover?: DocumentCoverMeta | null
}

export const DocumentPage: React.FC = () => {
  const { webid, docid, ...restParams } = useParams<{ webid: string; docid: string; snapshotVersion: string }>()
  const [blockSyncBatch] = useBlockSyncBatchMutation()
  const { onCommit } = syncProvider({ blockSyncBatch })

  const { data, loading } = useGetChildrenBlocksQuery({
    variables: { parentId: docid, excludePages: false, snapshotVersion: Number(restParams.snapshotVersion || '0') }
  })

  const prepareFileUpload = usePrepareFileUpload()
  const fetchUnsplashImages = useFetchUnsplashImages()
  const getImageUrl = (image: ImageSectionAttributes): string => {
    if (image.storageType === Filestoragetype.External) {
      return image.key
    }

    if (image.storageType === Filestoragetype.Origin) {
      return data?.childrenBlocks?.[0].blobs?.find(blob => blob.blobKey === image.key)?.url ?? ''
    }

    return ''
  }

  const editor = useEditor({
    onCommit,
    prepareFileUpload,
    fetchUnsplashImages,
    getImageUrl
  })

  const [icon, setIcon] = React.useState<DocumentIconMeta | null | undefined>()
  const [cover, setCover] = React.useState<DocumentCoverMeta | null | undefined>()
  const [title, setTitle] = React.useState<string | undefined>()

  useEffect(() => {
    if (editor && !editor.isDestroyed && data) {
      const content: JSONContent = blocksToJSONContents(data.childrenBlocks as Block[])[0]
      const attrs = content.attrs as BlockMeta

      /**
       * Document Meta
       */
      // initialize
      if (attrs.title && title === undefined) setTitle(attrs.title)
      if (attrs.cover && cover === undefined) setCover(attrs.cover as DocumentCoverMeta)
      if (attrs.icon && icon === undefined) setIcon(attrs.icon as DocumentIconMeta)
      // update TODO remove this
      if (title !== undefined && title !== attrs.title) attrs.title = title
      if (cover !== undefined && cover !== attrs.cover) (content.attrs as DocumentMeta).cover = cover
      if (icon !== undefined && icon !== attrs.icon) (content.attrs as DocumentMeta).icon = icon

      editor.commands.replaceRoot(content)
    }
  }, [editor, data, title, cover, icon])

  useDocumentSubscription({ docid, editor })

  if (loading) {
    return <Skeleton />
  }

  const DocumentTitleElement = (
    <DocumentTitle
      icon={icon}
      cover={cover}
      title={title}
      onCoverChange={setCover}
      onIconChange={setIcon}
      onTitleChange={setTitle}
      prepareFileUpload={prepareFileUpload}
      fetchUnsplashImages={fetchUnsplashImages}
    />
  )

  if (!docid) {
    return (
      <div className={styles.page}>
        {DocumentTitleElement}
        <EditorContent editor={editor} />
      </div>
    )
  }

  if (!data) {
    return <Alert message="Page not found" type="error" />
  }

  return (
    <div className={styles.page}>
      {DocumentTitleElement}
      <EditorContent editor={editor} />
    </div>
  )
}
