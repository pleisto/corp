import React from 'react'
import { useGetBlockSnapshotsQuery } from '@/BrickdocGraphQL'
import { Skeleton, Table } from '@brickdoc/design-system'
import { Link } from 'react-router-dom'
import { useDocsI18n } from '../../hooks'

interface SnapshotListProps {
  id: string
  webid: string
}

const SnapshotList: React.FC<SnapshotListProps> = props => {
  const { t } = useDocsI18n()

  const { data, loading } = useGetBlockSnapshotsQuery({ variables: { id: props.id } })
  if (loading) {
    return <Skeleton />
  }

  const columns = [
    { title: 'id', key: 'id', dataIndex: 'id', render: id => <Link to={`/${props.webid}/${id}`}>{id}</Link> },
    { title: t('snapshots.version'), key: 'snapshotVersion', dataIndex: 'snapshotVersion' }
  ]

  return <Table dataSource={data.blockSnapshots} columns={columns} />
}

export default SnapshotList
