import React from 'react'
import { Modal } from '@brickdoc/design-system'
import { useDocsI18n } from '../../hooks'
import { PodOperation } from '@/BrickdocGraphQL'

interface ProfileModalProps {
  webid: string
  visible: boolean
  type: PodOperation
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export const ProfileModal: React.FC<ProfileModalProps> = props => {
  const { t } = useDocsI18n()
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [modalText, setModalText] = React.useState('Content of the modal')

  const handleCancel = () => {
    console.log('Clicked cancel button')
    props.setVisible(false)
  }

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds')
    setConfirmLoading(true)
    setTimeout(() => {
      props.setVisible(false)
      setConfirmLoading(false)
    }, 2000)
  }

  return (
    <Modal
      title="Title"
      okText={t('design_system:modal.okText')}
      cancelText={t('design_system:modal.cancelText')}
      visible={props.visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}>
      <p>{modalText}</p>
    </Modal>
  )
}
