import { FC, useContext } from 'react'
import { useSettingsI18n } from '@/settings/common/hooks'
import { Panel } from '@/settings/common/components/Panel'
import { SettingsContextProps } from '@/settings/SettingContext'
import { Button } from '@brickdoc/design-system'
import { Trans } from 'react-i18next'
import { BrickdocContext } from '@/common/brickdocContext'

export const WebidUpdate: FC<{ pod: SettingsContextProps['pod'] }> = ({ pod }) => {
  const { t } = useSettingsI18n(['docs'])
  const { settings } = useContext(BrickdocContext)

  return (
    <Panel title={t(`general.change_webid`)}>
      <p>
        <Trans
          t={t}
          i18nKey="general.change_webid_desc"
          components={[
            // False positive
            // eslint-disable-next-line jsx-a11y/anchor-has-content, react/jsx-key
            <a target="_blank" href={settings?.kb_articles?.changing_webid} />
          ]}
        />
      </p>
      <Button>{t(`general.change_webid`)}</Button>
    </Panel>
  )
}
