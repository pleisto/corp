import { graphqlGroupType } from '@/helpers/types/graphql.types'

export const GRAPHQL_GROUP: graphqlGroupType = {
  BLOCK_SYNC_BATCH: `
    mutation blockSyncBatch($input: BlockSyncBatchInput!) {
      blockSyncBatch(input: $input) {
        errors
        __typename
      }
    }
  `,
  CREATE_BLOCK: `
    mutation blockCreate($input: BlockCreateInput!) {
      blockCreate(input: $input) {
        id
        errors
        __typename
      }
    }
  `,
  BLOCK_SOFT_DELETE: `
    mutation blockSoftDelete($input: BlockSoftDeleteInput!) {
      blockSoftDelete(input: $input) {
        errors
        __typename
      }
    }
  `,
  GET_PAGE_BLOCKS: `
    query GetPageBlocks($domain: String!) {
      pageBlocks(domain: $domain) {
        id
        parentId
      }
    }
  `,
  BLOCK_HARD_DELETE: `
    mutation blockHardDelete($input: BlockHardDeleteInput!) {
      blockHardDelete(input: $input) {
        errors
        __typename
      }
    }
  `,
  GET_TRASH_BLOCKS: `
    query GetTrashBlocks($domain: String!, $search: String) {
      trashBlocks(domain: $domain, search: $search) {
        id
      }
    }
  `,
  SPACE_DESTORY: `
    mutation SpaceDestroy($input: SpaceDestroyInput!) {
      spaceDestroy(input: $input) {
        errors
        __typename
      }
    }
  `,
  GET_SPACES: `
    query GetSpaces {
      spaces {
        id
        domain
        personal
      }
    }
  `,
  CREATE_OR_UPDATE_SPACE: `
    mutation createOrUpdateSpace($input: CreateOrUpdateSpaceInput!) {
      createOrUpdateSpace(input: $input) {}
    }
  `
}
