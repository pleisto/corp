import React, { useState } from 'react'
import { Button, Col, Modal, Row, Table } from '@brickdoc/design-system'
import { DocumentPage } from '@/docs/modules/pages/DocumentPage'
import { BlockSnapshot, useGetBlockSnapshotsQuery } from '@/BrickdocGraphQL'
import styles from './index.module.less'
import { useDocsI18n } from '../../hooks'
import Pic from '@/common/assets/cloud_brain_2.svg'

interface UpdateModalProps {
  webid: string
  visible: boolean
  blockId: string
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ webid, visible, blockId, setVisible }) => {
  const { t } = useDocsI18n()

  const [currentVersion, setCurrentVersion] = useState<number | undefined>()
  const { data } = useGetBlockSnapshotsQuery({ variables: { id: blockId } })

  const onOkOrCancel = (): void => {
    setVisible(false)
  }
  const onRestore = (): void => {
    // TODO restore
    console.log({ currentVersion })
  }

  const skelecton = (page: any, snapshots: any, disabled: boolean): any => {
    return (
      <Modal
        width={1000}
        title={null}
        footer={null}
        closable={false}
        destroyOnClose={true}
        visible={visible}
        onOk={onOkOrCancel}
        onCancel={onOkOrCancel}>
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
              <Button className={styles.buttons} onClick={onOkOrCancel}>
                {t('snapshots.cancel')}
              </Button>
            </div>
          </Col>
        </Row>
      </Modal>
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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    }
  ]

  // TODO change to List
  const snapshotData = (
    <Table
      dataSource={dataSource}
      columns={columns}
      onRow={record => {
        return {
          onClick: event => {
            console.log({ setVersion: record })
            setCurrentVersion(record.snapshotVersion)
          },
          onDoubleClick: event => {},
          onContextMenu: event => {},
          onMouseEnter: event => {},
          onMouseLeave: event => {}
        }
      }}
    />
  )

  return skelecton(
    <div className={styles.page}>
      <DocumentPage docid={blockId} snapshotVersion={currentVersion ?? firstVersion} />
    </div>,
    snapshotData,
    !currentVersion
  )
}
