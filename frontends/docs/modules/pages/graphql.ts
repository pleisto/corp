import { gql } from '@apollo/client'

export const BlockSync = gql`
  mutation blockSync($input: BlockSyncInput!) {
    blockSync(input: $input) {
      errors
    }
  }
`
