import { NewPatchDocument, Scalars, NewPatchPayload } from '@/BrickdocGraphQL'
import { useSubscription } from '@apollo/client'

type UUID = Scalars['UUID']

interface SubscriptionProps {
  webid: string
  docid: UUID
  patchHandler: (_: { newPatch: NewPatchPayload }) => void
}

export function useDocumentSubscription({ patchHandler, docid }: SubscriptionProps): void {
  useSubscription(NewPatchDocument, {
    onSubscriptionData: ({ subscriptionData: { data } }): void => {
      patchHandler(data)
    },
    variables: { docId: docid }
  })
}
