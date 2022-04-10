import React, { useState } from 'react'
import { Delete } from '@brickdoc/design-icons'
import { DocMetaProps } from '@/docs/pages/DocumentContentPage'
import { useDocsI18n } from '../../hooks'
import { TrashPopover } from '../TrashPopover'
import { sidebarButtonStyles } from '@/docs/pages/DocumentContentPage.style'
import { Button, Tooltip } from '@brickdoc/design-system'

export const TrashButton: React.FC<DocMetaProps> = ({ docMeta }) => {
  const { t } = useDocsI18n()
  const [trashModalVisible, setTrashModalVisible] = useState<boolean>(false)

  const onClick = (): void => {
    setTrashModalVisible(true)
  }

  return (
    <Tooltip title={t('trash.name')}>
      <Button type="text" css={sidebarButtonStyles} icon={<Delete />} onClick={onClick} />
      <TrashPopover docMeta={docMeta} visible={trashModalVisible} setVisible={setTrashModalVisible} />
    </Tooltip>
  )
}
