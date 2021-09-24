import React from 'react'
import { Button, Col, List, Row } from '@brickdoc/design-system'
import { DocumentPage } from '@/docs/modules/pages/DocumentPage'
import { BlockSnapshot, useGetBlockSnapshotsQuery } from '@/BrickdocGraphQL'
import styles from './index.module.less'
import { useDocsI18n } from '../../hooks'
import Pic from '@/common/assets/cloud_brain_2.svg'

interface SnapshotListProps {
  blockId: string
  currentVersion: number | undefined
  setCurrentVersion: React.Dispatch<React.SetStateAction<number | undefined>>
  confirmLoading: boolean
  setConfirmLoading: React.Dispatch<React.SetStateAction<boolean>>
  onCleanup: () => void
}

export const SnapshotList: React.FC<SnapshotListProps> = ({
  blockId,
  currentVersion,
  setCurrentVersion,
  confirmLoading,
  onCleanup,
  setConfirmLoading
}) => {
  const { t } = useDocsI18n()
  const { data } = useGetBlockSnapshotsQuery({ variables: { id: blockId } })

  const onRestore = (): void => {
    // TODO restore
    setConfirmLoading(true)
    console.log({ currentVersion })
    setTimeout(() => {
      onCleanup()
    }, 2000)
  }

  const skelecton = (page: any, snapshots: any, disabled: boolean): any => {
    return (
      <Row>
        <Col span={18} className={styles.row}>
          {page}
        </Col>
        <Col span={6} className={styles.row}>
          <div className={styles.snapshot}>{snapshots}</div>
          <div>
            <Button type="primary" className={styles.buttons} disabled={disabled} onClick={onRestore}>
              {t('snapshots.restore')}
            </Button>
            <br />
            <Button className={styles.buttons} onClick={onCleanup}>
              {t('snapshots.cancel')}
            </Button>
          </div>
        </Col>
      </Row>
    )
  }

  if (!data?.blockSnapshots || data.blockSnapshots.length === 0) {
    return skelecton(
      <div>
        <img className={styles.image} src={Pic} alt="cloud_brain_2" />
        <br />
        <span className={styles.text}>{t('snapshots.empty')}</span>
      </div>,
      <>&nbsp;</>,
      true
    )
  }

  const dataSource = data.blockSnapshots.map((snapshot: BlockSnapshot) => ({
    key: snapshot.id,
    name: snapshot.name,
    snapshotVersion: snapshot.snapshotVersion
  }))

  const firstVersion = Math.max(...data.blockSnapshots.map(snapshot => snapshot.snapshotVersion))

  const snapshotData = (
    <List
      size="small"
      footer={null}
      header={null}
      dataSource={dataSource}
      renderItem={item => (
        <List.Item>
          <button
            className={styles.text_button}
            onClick={event => {
              setCurrentVersion(item.snapshotVersion)
            }}>
            <span style={{ color: item.snapshotVersion === currentVersion ? 'blue' : 'unset' }}>{item.name}</span>
          </button>
        </List.Item>
      )}
    />
  )

  return skelecton(
    <div className={styles.page}>
      <DocumentPage docid={blockId} editable={false} snapshotVersion={currentVersion ?? firstVersion} />
    </div>,
    snapshotData,
    !currentVersion || confirmLoading
  )
}
