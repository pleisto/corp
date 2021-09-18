import { Button } from '@brickdoc/design-system'
import React, { useState } from 'react'
import { useDocsI18n } from '../../hooks'
import { UpdateModal } from '../UpdateModal'

interface UpdateButtonProps {
  id: string
  webid: string
}

export const UpdateButton: React.FC<UpdateButtonProps> = ({ id, webid }) => {
  const { t } = useDocsI18n()
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  if (!id) {
    return <></>
  }
  const onClick = (): void => {
    setUpdateModalVisible(true)
  }
  return (
    <>
      <Button type="text" onClick={onClick}>
        {t('update.text')}
      </Button>
      <UpdateModal webid={webid} blockId={id} visible={updateModalVisible} setVisible={setUpdateModalVisible} />
    </>
  )
}
