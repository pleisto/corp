import React from 'react'
import { useApolloClient } from '@apollo/client'
import { BrickdocEventBus, loadDocHistory, docHistoryReceived, EventSubscribed } from '@brickdoc/schema'
import { DocumentHistoriesDocument, DocumentHistory } from '@/BrickdocGraphQL'
import { devLog } from '@brickdoc/design-system'

export function useDocHistoryProvider(docId: string): void {
  const client = useApolloClient()

  const fetchHistories = React.useCallback(async () => {
    const { data } = await client.query({
      query: DocumentHistoriesDocument,
      variables: {
        id: docId
      },
      fetchPolicy: 'no-cache'
    })
    // TODO: users
    const { histories } = data.documentHistories

    BrickdocEventBus.dispatch(
      docHistoryReceived({
        docId,
        histories: Object.fromEntries((histories as DocumentHistory[]).map(h => [h.id, h])),
        users: {}
      })
    )
  }, [docId, client])

  React.useEffect(() => {
    const subscriptions: EventSubscribed[] = [
      BrickdocEventBus.subscribe(
        loadDocHistory,
        ({ payload }) => {
          devLog(`loading doc history ${docId}`)
          void fetchHistories()
        },
        { subscribeId: docId }
      )
    ]
    return () => {
      subscriptions.forEach(sub => sub.unsubscribe())
    }
  }, [docId, fetchHistories])
}
