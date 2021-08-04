import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Skeleton } from '@brickdoc/design-system'
import { EditorContent, ImageSectionAttributes, useEditor } from '@brickdoc/editor'
import { useBlockSyncBatchMutation, useGetChildrenBlocksQuery, Block, Filestoragetype } from '@/BrickdocGraphQL'
import { DocumentTitle } from './DocumentTitle'
import { syncProvider, blocksToJSONContents } from './SyncProvider'
import { useDocumentSubscription } from './useDocumentSubscription'
import { usePrepareFileUpload } from './usePrepareFileUpload'
import { useFetchUnsplashImages } from './useFetchUnsplashImages'
import styles from './DocumentPage.module.less'
import { DocumentIconMeta } from './DocumentTitle/DocumentIcon'
import { DocumentCoverMeta } from './DocumentTitle/DocumentCover'
import { JSONContent } from '@tiptap/core'

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

  const setTitle = (newTitle: string): void => {
    if (!editor || editor.isDestroyed) return
    editor.commands.setDocAttrs({
      ...editor.state.doc.attrs,
      title: newTitle
    })
  }
  const setIcon = (newIcon: DocumentIconMeta | null | undefined): void => {
    if (!editor || editor.isDestroyed) return
    editor.commands.setDocAttrs({
      ...editor.state.doc.attrs,
      icon: newIcon
    })
  }
  const setCover = (newCover: DocumentCoverMeta | null | undefined): void => {
    if (!editor || editor.isDestroyed) return
    editor.commands.setDocAttrs({
      ...editor.state.doc.attrs,
      cover: newCover
    })
  }

  useEffect(() => {
    if (editor && !editor.isDestroyed && data) {
      const content: JSONContent = blocksToJSONContents(data.childrenBlocks as Block[])[0]

      editor.commands.replaceRoot(content)
    }
  }, [editor, data])

  useDocumentSubscription({ docid, editor })

  if (loading) {
    return <Skeleton />
  }

  const DocumentTitleElement = (
    <DocumentTitle
      icon={editor?.state.doc.attrs.icon}
      cover={editor?.state.doc.attrs.cover}
      title={editor?.state.doc.attrs.title}
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
