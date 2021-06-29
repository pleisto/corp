import React from 'react'
import { useParams } from 'react-router-dom'
import { Editor } from '@brickdoc/editor'
import { currentWebidVar } from '@/docs/vars'
import { syncProvider } from './SyncProvider'
import { useBlockSyncMutation } from '@/BrickdocGraphQL'

const Page: React.FC = () => {
  const { webid, docid } = useParams()
  const [blockSync] = useBlockSyncMutation()

  currentWebidVar(webid)
  return (
    <div>
      <h1>
        WIP - ${webid} ${docid}
      </h1>
      <Editor syncCallback={syncProvider(blockSync)} />
    </div>
  )
}
export default Page
