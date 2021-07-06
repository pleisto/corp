import React from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Skeleton } from '@brickdoc/design-system'
import { Editor } from '@brickdoc/editor'
import { syncProvider, nest } from './SyncProvider'
import { useBlockSyncBatchMutation, useGetChildrenBlocksQuery } from '@/BrickdocGraphQL'

const Page: React.FC = () => {
  const { webid, docid } = useParams<{ webid: string; docid: string }>()
  const [blockSyncBatch] = useBlockSyncBatchMutation()
  const syncCallback = syncProvider({ blockSyncBatch })
  const { data, loading } = useGetChildrenBlocksQuery({ variables: { parentId: docid, excludePages: false } })

  if (loading) {
    return <Skeleton />
  }

  if (!docid) {
    return (
      <div>
        <Editor syncCallback={syncCallback} />
      </div>
    )
  }

  if (!data) {
    console.log(`error: ${webid} ${docid}`)
    return <Alert message="Page not found" type="error" />
  }

  const content = nest(data.childrenBlocks as any)[0]
  return (
    <div>
      <Editor syncCallback={syncCallback} content={content} />
    </div>
  )
}
export default Page
