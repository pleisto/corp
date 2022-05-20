import { gql } from '@apollo/client'

export const getDocument = gql`
  query GetDocument($id: String!) {
    document(id: $id) {
      id
      stateId
      state
    }
  }
`

export const SyncDocument = gql`
  mutation SyncDocument($input: SyncDocumentInput!) {
    syncDocument(input: $input) {
      document {
        state
        stateId
      }
    }
  }
`