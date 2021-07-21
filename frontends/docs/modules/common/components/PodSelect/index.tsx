import React, { useState } from 'react'
import {
  useGetPodsQuery,
  useUserSignOutMutation,
  UserSignOutInput,
  // useCreateOrUpdatePodMutation,
  // CreateOrUpdatePodInput,
  useSwitchPodMutation,
  SwitchPodInput,
  PodOperation
} from '@/BrickdocGraphQL'
import { Dropdown, Avatar, Skeleton, Menu } from '@brickdoc/design-system'
import { SortTwo } from '@brickdoc/design-system/components/icon'
import { useDocsI18n } from '../../hooks'
import { useHistory, Redirect } from 'react-router'
import styles from './index.module.less'
import { useBoolean } from 'ahooks'
import { ProfileModal } from '../ProfileModal'

interface PodSelectProps {
  webid: string
}

const PodSelect: React.FC<PodSelectProps> = props => {
  const history = useHistory()
  const { t } = useDocsI18n()
  const { loading, data } = useGetPodsQuery()
  const [userSignOutMutation] = useUserSignOutMutation()
  // const [createOrUpdatePodMutation] = useCreateOrUpdatePodMutation()
  const [switchPodMutation] = useSwitchPodMutation()
  const [didRedirectToSignInPage, { setTrue: redirectToSignInPage }] = useBoolean(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [operationType, setOperationType] = useState<PodOperation>()

  if (didRedirectToSignInPage) {
    return <Redirect to="/" />
  }

  if (loading) {
    return <Skeleton avatar active paragraph={false} />
  }

  const pod = !loading && data.pods.find(pod => pod.webid === props.webid)

  if (!pod) {
    console.error('Webid does not match the current user')
    return <></>
  }

  const onClick = ({ key }): void => {
    const signOutInput: UserSignOutInput = {}
    // const createPodInput: CreateOrUpdatePodInput = { webid: '123', type: 'CREATE', name: 'asd' }
    switch (key) {
      case 'pod-create':
        setOperationType(PodOperation.Create)
        // void createOrUpdatePodMutation({ variables: { input: createPodInput } })
        break
      case 'pod-profile':
        setOperationType(PodOperation.Update)
        setModalVisible(true)
        break
      case 'logout':
        void userSignOutMutation({ variables: { input: signOutInput } })
        // TODO how to redirect to index by click
        redirectToSignInPage()
        break
      default:
        if (key.startsWith('pod-')) {
          const webid = key.replace('pod-', '')
          const input: SwitchPodInput = { webid }
          void switchPodMutation({ variables: { input } })
          history.push(`/${webid}`)
        } else {
          console.log(`unknown key ${key}`)
        }

        break
    }
  }

  const dropdown = (
    <Menu onClick={onClick} selectedKeys={[`pod-${pod.webid}`]}>
      {data.pods.map(i => (
        <Menu.Item key={`pod-${i.webid}`}>{i.name}</Menu.Item>
      ))}
      <Menu.Divider />
      <Menu.Item key="pod-create">{t('menu.create_new_pod')}</Menu.Item>
      <Menu.Item key="pod-profile">{t('menu.pod_profile')}</Menu.Item>
      <Menu.Item key="logout">{t('menu.logout')}</Menu.Item>
    </Menu>
  )

  return (
    <>
      <Dropdown trigger={['click']} overlay={dropdown} placement="bottomLeft">
        <div className={styles.select}>
          <Avatar style={{ background: '#2376b7' }} shape="square">
            B
          </Avatar>
          <div className={styles.name}>
            <span>{pod.name}</span>
            <SortTwo />
          </div>
        </div>
      </Dropdown>
      <ProfileModal webid={props.webid} type={operationType} visible={modalVisible} setVisible={setModalVisible} />
    </>
  )
}

export default PodSelect
