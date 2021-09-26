import React from 'react'
import { useParams } from 'react-router-dom'
import { UpdateButton } from '../common/components/UpdateButton'
import { SidebarLayoutPage } from '../common/layouts/SidebarLayoutPage'
import { DocumentPage } from './DocumentPage'

export const DocumentContent: React.FC = () => {
  const { webid, docid, snapshotVersion } = useParams<{ webid: string; docid: string; snapshotVersion: string }>()
  return (
    <SidebarLayoutPage webid={webid} docid={docid}>
      <div style={{ float: 'right' }}>
        <UpdateButton id={docid} webid={webid} />
      </div>
      <DocumentPage docid={docid} editable={true} snapshotVersion={Number(snapshotVersion || '0')} />
    </SidebarLayoutPage>
  )
}
