import React from 'react'
import {
  useGetPodsQuery,
  useUserSignOutMutation,
  UserSignOutInput,
  useCreatePodMutation,
  CreatePodInput,
  useSwitchPodMutation,
  SwitchPodInput
} from '@/BrickdocGraphQL'
import { Dropdown, Avatar, Skeleton, Menu } from '@brickdoc/design-system'
import { SortTwo } from '@brickdoc/design-system/components/icon'
import { useDocsI18n } from '../../hooks'
import { useHistory, Redirect } from 'react-router'
import styles from './index.module.less'
import { useBoolean } from 'ahooks'

interface PodSelectProps {
  webid: string
}

const PodSelect: React.FC<PodSelectProps> = props => {
  const history = useHistory()
  const { t } = useDocsI18n()
  const { loading, data } = useGetPodsQuery()
  const [userSignOutMutation] = useUserSignOutMutation()
  const [createPodMutation] = useCreatePodMutation()
  const [switchPodMutation] = useSwitchPodMutation()
  const [didRedirectToSignInPage, { setTrue: redirectToSignInPage }] = useBoolean(false)

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
    const createPodInput: CreatePodInput = { webid: '123', name: 'asd' }
    switch (key) {
      case 'pod-create':
        void createPodMutation({ variables: { input: createPodInput } })
        break
      case 'pod-profile':
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
  )
}

export default PodSelect
