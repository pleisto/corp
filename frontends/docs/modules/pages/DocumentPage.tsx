import React from 'react'
import { useParams } from 'react-router-dom'
import { Editor } from '@brickdoc/editor'
import { currentWebidVar } from '@/docs/vars'
import { GraphqlProvider } from './GraphqlProvider'

const Page: React.FC = () => {
  const { webid, docid } = useParams()
  currentWebidVar(webid)
  return (
    <div>
      <h1>
        WIP - ${webid} ${docid}
      </h1>
      <Editor provider={GraphqlProvider} />
    </div>
  )
}
export default Page
