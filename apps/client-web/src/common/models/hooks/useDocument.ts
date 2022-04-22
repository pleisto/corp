import React from 'react'
import { Node } from 'prosemirror-model'
// import { BrickdocModelStore } from '../store'
import { Document } from '../models'
import { Block } from '@brickdoc/schema'

import { useSyncProvider } from '../../../docs/pages/hooks'

export const useDocument = (options: {
  docId: string
  forceReload?: boolean
}): {
  document?: Document
  rootBlock: React.MutableRefObject<Block | undefined>
  loading: boolean
  onDocSave: (doc: Node) => Promise<void>
} => {
  const { docId } = options
  const [document, setDocument] = React.useState<Document>()
  const [loading, setLoading] = React.useState<boolean>(true)

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
      blocks: data?.childrenBlocks as Block[]
    }

    setLoading(blocksLoading)
    setDocument(newDocument)
  }, [data?.childrenBlocks, blocksLoading])

  return {
    document,
    rootBlock,
    loading,
    onDocSave
  }
}
