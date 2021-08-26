import {
  GetDatabaseRowBlocksQuery as Query,
  GetDatabaseRowBlocksQueryVariables as Variables,
  GetDatabaseRowBlocksDocument,
  useBlockUpdateMutation,
  BlockInput,
  BlockUpdateInput
} from '@/BrickdocGraphQL'
import { useImperativeQuery } from '@/common/hooks'
import { EditorOptions } from '@brickdoc/editor'

export function useDatabaseRows(): EditorOptions['getDatabaseRows'] {
  const queryDatabaseRowBlocks = useImperativeQuery<Query, Variables>(GetDatabaseRowBlocksDocument)

  return async (parentId: string, snapshotVersion: number) => {
    const { data, error } = await queryDatabaseRowBlocks({ parentId, snapshotVersion })

    return {
      success: !error,
      data: data.databaseRowBlocks as []
    }
  }
}

export function useSaveDatabaseRow(): EditorOptions['saveDatabaseRow'] {
  const [blockUpdate] = useBlockUpdateMutation()
  return async (block: { parentId: string; id: string; data: {} }) => {
    const blockArg: BlockInput = {
      id: block.id,
      data: block.data,
      parentId: block.parentId,
      type: 'databaseRow',
      content: [],
      text: ''
    }
    const input: BlockUpdateInput = { block: blockArg }
    await blockUpdate({ variables: { input } })
  }
}
