/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react'
import { Node } from 'prosemirror-model'
import { useApolloClient } from '@apollo/client'
import {
  BlockInput,
  Block,
  useGetChildrenBlocksQuery,
  useGetDocumentQuery,
  useBlockSyncBatchMutation,
  useSyncDocumentMutation,
  useYdocSubscription,
  GetSpreadsheetChildrenDocument
} from '@/BrickdocGraphQL'
import { isEqual } from '@brickdoc/active-support'
import { devLog } from '@brickdoc/design-system'
import { isSavingVar } from '../../reactiveVars'
import { nodeToBlock } from '../../common/blocks'
import {
  BrickdocEventBus,
  Event,
  BlockUpdated,
  BlockDeleted,
  BlockNameLoad,
  BlockSynced,
  UpdateBlock,
  DeleteBlock,
  CommitBlocks,
  loadSpreadsheetBlocks,
  SpreadsheetLoaded
} from '@brickdoc/schema'
import { BrickdocContext } from '@/common/brickdocContext'
import * as Y from 'yjs'
import { base64 } from 'rfc4648'
import { v4 } from 'uuid'

export type UpdateBlocks = (blocks: BlockInput[], toDeleteIds: string[]) => Promise<void>

export function useSyncProvider(queryVariables: { rootId: string; snapshotVersion: number }): {
  rootBlock: React.MutableRefObject<Block | undefined>
  data: any
  loading: boolean
  refetch: any
  onDocSave: (doc: Node) => Promise<void>
  updateBlocks: UpdateBlocks
  ydoc: React.MutableRefObject<Y.Doc | undefined>
  initBlocksToEditor: React.MutableRefObject<boolean>
  // updateCachedDocBlock: (block: Block, toDelete: boolean) => void
} {
  const {
    features: { experiment_collaboration: enableCollaboration }
  } = React.useContext(BrickdocContext)

  const rootId = React.useRef<string>(queryVariables.rootId)

  const { data, loading, refetch } = useGetChildrenBlocksQuery({
    fetchPolicy: 'no-cache',
    variables: queryVariables
  })

  const { data: documentData, loading: documentLoading } = useGetDocumentQuery({
    fetchPolicy: 'no-cache',
    variables: { docId: queryVariables.rootId }
  })

  const client = useApolloClient()
  const [blockSyncBatch] = useBlockSyncBatchMutation()
  const [syncDocument] = useSyncDocumentMutation()

  const committing = React.useRef(false)

  const cachedBlocksMap = React.useRef(new Map<string, Block>())
  const docBlocksMap = React.useRef(new Map<string, Block>())
  const rootBlock = React.useRef<Block | undefined>()

  const ydoc = React.useRef<Y.Doc | undefined>()
  const stateId = React.useRef<string>()
  const initBlocksToEditor = React.useRef<boolean>(false)
  const committingDocumentState = React.useRef(false)
  // const documentStateDirty = React.useRef(false)
  const updatesToCommit = React.useRef(new Set<Uint8Array>())

  const dirtyBlocksMap = React.useRef(new Map<string, BlockInput>())
  const dirtyToDeleteIds = React.useRef(new Set<string>())

  // TODO
  // if (enableCollaboration) {
  useYdocSubscription({
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      // if (data) {
      //   const {
      //     ydoc: { operatorId, updates }
      //   } = data
      //   if (operatorId !== globalThis.brickdocContext.uuid) {
      //     console.log(operatorId, updates)
      //     if (ydoc.current) {
      //       Y.applyUpdate(ydoc.current, Uint8Array.from(updates))
      //     }
      //   }
      // }
    },
    variables: { docId: rootId.current }
  })
  // }

  const commitState = React.useCallback(
    async (update?: Uint8Array): Promise<void> => {
      if (!ydoc.current) return

      devLog(`try commit state, committing:`, committingDocumentState.current)
      if (committingDocumentState.current) {
        if (update) updatesToCommit.current.add(update)
        return
      }

      committingDocumentState.current = true

      const stateIdToSync = v4()
      const stateToSync = Y.encodeStateAsUpdate(ydoc.current)
      const updatesToSync = [...updatesToCommit.current.values()]

      devLog(`commit state ${stateIdToSync} from ${stateId.current}`)

      const syncPromise = syncDocument({
        variables: {
          input: {
            docId: rootId.current,
            operatorId: globalThis.brickdocContext.uuid,
            state: base64.stringify(stateToSync),
            updates: base64.stringify(Y.mergeUpdates(updatesToSync)),
            stateId: stateIdToSync,
            previousStateId: stateId.current
          }
        }
      })
      const { data: syncDocumentResult } = await syncPromise

      const resultDocument = syncDocumentResult?.syncDocument?.document

      if (resultDocument) {
        committingDocumentState.current = false
        const { stateId: echoStateId, state: remoteStateStr } = resultDocument
        if (echoStateId === stateIdToSync) {
          stateId.current = stateIdToSync
          updatesToSync.forEach(update => updatesToCommit.current.delete(update))
          devLog('committed, left updates: ', updatesToCommit.current.size)
          if (updatesToCommit.current.size !== 0) {
            commitState()
          }
        } else if (remoteStateStr && echoStateId) {
          devLog(`need to merge state ${stateId.current} with ${echoStateId}`)
          const remoteState = base64.parse(remoteStateStr)
          const remoteYector = Y.encodeStateVectorFromUpdate(remoteState)
          const diff = Y.diffUpdate(stateToSync, remoteYector)
          // const mergedState = Y.mergeUpdates([state, diff])
          if (ydoc.current) {
            Y.applyUpdate(ydoc.current, diff)
            stateId.current = echoStateId
            const localVector = Y.encodeStateVector(ydoc.current)
            const nextUpdate = Y.diffUpdate(remoteState, localVector)
            commitState(nextUpdate)
          }
        }
      }
    },
    [syncDocument]
  )

  React.useEffect(() => {
    rootId.current = queryVariables.rootId
    cachedBlocksMap.current = new Map<string, Block>()
    docBlocksMap.current = new Map<string, Block>()
    dirtyBlocksMap.current = new Map<string, Block>()
    dirtyToDeleteIds.current = new Set<string>()
    data?.childrenBlocks?.forEach(_block => {
      const block = _block as Block
      // cachedBlocksMap.current.set(block.id, block)
      docBlocksMap.current.set(block.id, block)
    })
    rootBlock.current = docBlocksMap.current.get(rootId.current)

    if (enableCollaboration && rootId.current) {
      if (documentData && !documentLoading) {
        const { document } = documentData

        const newYdoc = new Y.Doc()
        devLog('Ydoc initialized')

        if (document?.state && document?.stateId) {
          devLog(`init from state ${document.stateId}`)
          const state = base64.parse(document.state)
          devLog(state)
          Y.applyUpdate(newYdoc, state)
          stateId.current = document.stateId
        } else {
          devLog('need to commit init state')
          initBlocksToEditor.current = true
        }

        newYdoc.on('update', async (update, origin, doc) => {
          commitState(update)
        })

        ydoc.current = newYdoc
      }
    } else if (data?.childrenBlocks) {
      initBlocksToEditor.current = true
    }
  }, [queryVariables, documentData, data?.childrenBlocks, enableCollaboration, commitState, documentLoading])

  const commitDirty = async (): Promise<void> => {
    if (!dirtyBlocksMap.current.size && !dirtyToDeleteIds.current.size) return
    if (committing.current) return

    committing.current = true

    try {
      const blocks: BlockInput[] = Array.from(dirtyBlocksMap.current.values())
        .filter(
          // commit only if parent block in doc
          ({ parentId, id }) =>
            (!parentId || id === rootId.current || cachedBlocksMap.current.get(parentId)) ??
            docBlocksMap.current.get(parentId) ??
            dirtyBlocksMap.current.get(parentId)
        )
        .map(b => {
          // HACK: delete all __typename
          const block = { __typename: undefined, ...b, meta: b.meta ?? {} }
          delete block.__typename
          return block
        })

      const deletedIds = [...dirtyToDeleteIds.current]

      if (blocks.length > 0 || deletedIds.length > 0) {
        blocks.forEach(b => {
          if (!b.parentId || b.type === 'doc') {
            BrickdocEventBus.dispatch(BlockNameLoad({ id: b.id, name: b.text }))
          }
          BrickdocEventBus.dispatch(BlockUpdated(b))
          dirtyBlocksMap.current.delete(b.id)
        })
        deletedIds.forEach(id => {
          BrickdocEventBus.dispatch(BlockDeleted({ id }))
          dirtyToDeleteIds.current.delete(id)
        })

        const syncPromise = blockSyncBatch({
          variables: {
            input: {
              blocks,
              deletedIds,
              rootId: rootId.current,
              operatorId: globalThis.brickdocContext.uuid
            }
          }
        })
        await syncPromise
        blocks.forEach(b => {
          BrickdocEventBus.dispatch(BlockSynced(b))
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      committing.current = false
    }
    if (dirtyBlocksMap.current.size === 0 && dirtyToDeleteIds.current.size === 0) {
      isSavingVar(false)
    } else {
      setTimeout(() => {
        void commitDirty()
      }, 500)
    }
  }

  const onDocSave = async (doc: Node): Promise<void> => {
    if (!docBlocksMap.current.size) return
    isSavingVar(true)
    const docBlocks = nodeToBlock(doc, 0)
    const deletedIds = new Set(docBlocksMap.current.keys())
    deletedIds.delete(rootId.current)

    // Document Blocks dirty check and maintian
    docBlocks.forEach(newBlock => {
      newBlock.sort = `${newBlock.sort}`
      const oldBlock = docBlocksMap.current.get(newBlock.id)
      // TODO: Improve dirty check
      if (!oldBlock || !isEqual(oldBlock, newBlock)) {
        dirtyBlocksMap.current.set(newBlock.id, newBlock)
        docBlocksMap.current.set(newBlock.id, newBlock as Block)
      }
      deletedIds.delete(newBlock.id)
    })

    deletedIds.forEach(id => {
      dirtyToDeleteIds.current.add(id)
      docBlocksMap.current.delete(id)
    })

    await commitDirty()
  }

  BrickdocEventBus.subscribe(
    BlockUpdated,
    (e: Event) => {
      const block: Block = e.payload
      const oldBlock = docBlocksMap.current.get(block.id) ?? {}
      if (docBlocksMap.current.get(block.id)) {
        // update only on doc blocks
        docBlocksMap.current.set(block.id, { ...oldBlock, ...block })
      } else {
        cachedBlocksMap.current.set(block.id, { ...oldBlock, ...block })
      }

      if (block.id === rootId.current) {
        client.cache.modify({
          id: client.cache.identify({ __typename: 'BlockInfo', id: block.id }),
          fields: {
            title() {
              return block.text
            },
            icon() {
              return block.meta.icon
            }
          }
        })
        client.cache.modify({
          id: client.cache.identify({ __typename: 'BlockPath', id: block.id }),
          fields: {
            text() {
              return block.text
            }
          }
        })
        client.cache.modify({
          id: client.cache.identify({ __typename: 'block', id: block.id }),
          fields: {
            text() {
              return block.text
            },
            meta() {
              return block.meta
            }
          }
        })
      }
    },
    { subscribeId: 'SyncProvider' }
  )

  BrickdocEventBus.subscribe(
    BlockDeleted,
    (e: Event) => {
      const block: Block = e.payload
      docBlocksMap.current.delete(block.id)
    },
    { subscribeId: 'SyncProvider' }
  )

  BrickdocEventBus.subscribe(
    UpdateBlock,
    (e: Event) => {
      // isSavingVar(true)
      const { block, commit } = e.payload
      dirtyBlocksMap.current.set(block.id, block)
      if (commit) {
        void commitDirty()
      }
    },
    { subscribeId: 'SyncProvider' }
  )

  BrickdocEventBus.subscribe(
    DeleteBlock,
    (e: Event) => {
      // isSavingVar(true)
      const { blockId, commit } = e.payload
      dirtyToDeleteIds.current.add(blockId)
      if (commit) {
        void commitDirty()
      }
    },
    { subscribeId: 'SyncProvider' }
  )

  BrickdocEventBus.subscribe(
    CommitBlocks,
    (e: Event) => {
      isSavingVar(true)
      void commitDirty()
    },
    { subscribeId: 'SyncProvider' }
  )

  BrickdocEventBus.subscribe(
    loadSpreadsheetBlocks,
    (e: Event) => {
      const parentId = e.payload
      devLog(`loading spreadsheet ${parentId}`)
      void (async () => {
        const { data } = await client.query({
          query: GetSpreadsheetChildrenDocument,
          variables: {
            parentId
          },
          fetchPolicy: 'no-cache'
        })
        const { blocks } = data.spreadsheetChildren
        blocks.forEach((block: Block) => {
          cachedBlocksMap.current.set(block.id, block)
        })
        BrickdocEventBus.dispatch(
          SpreadsheetLoaded({
            parentId,
            blocks
          })
        )
      })()
    },
    { subscribeId: 'SyncProvider' }
  )

  const updateBlocks = async (blocks: BlockInput[], toDeleteIds: string[]): Promise<void> => {
    isSavingVar(true)
    blocks.forEach(block => dirtyBlocksMap.current.set(block.id, block))
    toDeleteIds.forEach(id => dirtyToDeleteIds.current.add(id))

    await commitDirty()
  }

  return {
    rootBlock,
    data,
    loading,
    refetch,
    onDocSave,
    updateBlocks,
    ydoc,
    initBlocksToEditor
  }
}
