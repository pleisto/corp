import React from 'react'
import { Node } from 'prosemirror-model'
import { BrickdocModelStore } from '../store'
import { ModelIdentifier } from '../types'
import { Document, DocumentMeta } from '../models'
import { Block, BrickdocEventBus, UpdateDocMeta } from '@brickdoc/schema'

import { useSyncProvider } from '@/docs/pages/hooks'

export const useDocument = (options: {
  docId: string
  forceReload?: boolean
}): {
  document: Document
  rootBlock: React.MutableRefObject<Block | undefined>
  loading: boolean
  onDocSave: (doc: Node) => Promise<void>
  saveDocument: (document: Document) => void
} => {
  const { docId } = options
  const [document, setDocument] = React.useState<Document>({ id: docId })
  const [loading, setLoading] = React.useState<boolean>(true)

  const modelId: ModelIdentifier = React.useMemo(() => {
    return { type: 'document', id: docId }
  }, [docId])

  // TODO: remove old blocks API
  const {
    data,
    loading: blocksLoading,
    rootBlock,
    onDocSave
  } = useSyncProvider({
    rootId: docId,
    snapshotVersion: 0
  })

  React.useEffect(() => {
    const newDocument = {
      id: docId,
      meta: rootBlock.current?.meta, // TODO: new document meta
      blocks: data?.childrenBlocks as Block[]
    }

    setLoading(blocksLoading)
    setDocument(newDocument)
  }, [docId, data?.childrenBlocks, blocksLoading, rootBlock])

  const saveDocument = React.useCallback(
    (newDocument: Document) => {
      setDocument(newDocument)
      // TODO: eventbus dispatch
      BrickdocEventBus.dispatch(UpdateDocMeta({ id: docId, meta: newDocument.meta as DocumentMeta }))
      BrickdocModelStore.set(modelId, newDocument)
    },
    [modelId, docId]
  )

  return {
    document,
    rootBlock,
    loading,
    onDocSave,
    saveDocument
  }
}
