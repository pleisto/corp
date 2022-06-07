import React from 'react'
import { BlockState, ThinUser, loadDocHistory, docHistoryReceived, BrickdocEventBus } from '../'

interface docHistoryStore {
  histories: { [key: string]: BlockState }
  users: { [key: string]: ThinUser }
}

export const useDocHistoryStore = (
  docId: string
): {
  refetch: () => void
  store: docHistoryStore
} => {
  const [store, setStore] = React.useState<docHistoryStore>({
    histories: {},
    users: {}
  })
  BrickdocEventBus.subscribe(
    docHistoryReceived,
    ({ payload }) => {
      const old = store
      setStore({
        ...old,
        histories: {
          ...old.histories,
          ...payload.histories
          // ...Object.fromEntries(
          //    payload.histories.map(h => [h.id, h])
          // )
        },
        users: {
          ...old.users,
          ...payload.users
        }
      })
    },
    {
      subscribeId: docId
    }
  )

  const refetch = React.useCallback(() => {
    BrickdocEventBus.dispatch(loadDocHistory(docId))
    // BrickdocEventBus.dispatch(docHistoryReceived({
    //   docId,
    //   histories: {
    //     'test': {
    //       id: 'test'
    //     }
    //   },
    //   users: {}
    // }))
  }, [docId])
  return {
    store,
    refetch
  }
}
