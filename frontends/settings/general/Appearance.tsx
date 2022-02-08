import { FC } from 'react'
import { useSettingsI18n } from '@/settings/common/hooks'
import { Panel } from '@/settings/common/components/Panel'
import { SettingsContextProps } from '@/settings/SettingContext'

export const Appearance: FC<{ pod: SettingsContextProps['pod'] }> = ({ pod }) => {
  const { t } = useSettingsI18n(['docs'])

  return <Panel title={t('general.appearance')}>Todo: Timezone and Language settings</Panel>
}
