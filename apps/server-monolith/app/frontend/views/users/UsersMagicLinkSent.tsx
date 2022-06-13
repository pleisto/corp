import { applicationLayout } from '../layouts/ApplicationLayout'
import { styled, theme } from '@brickdoc/design-system'
import { ImageIcon } from '@brickdoc/design-icons'
import { useI18n } from '../../hooks'
import Icon from '@brickdoc/server-monolith/app/frontend/assets/users/magic_link_sent.svg'

const EmailAddress = styled('h1', {
  marginY: '1.5rem',
  fontSize: theme.fontSizes.title4,
  lineHeight: theme.lineHeights.title4
})

const Desc = styled('p', {
  whiteSpace: 'pre-wrap'
})

const UsersMagicLinkSent: InertiaFC<{ email: string }> = ({ email }) => {
  const { t } = useI18n()
  return (
    <main id="panel-card">
      <ImageIcon src={Icon} alt={t('auth_providers.magic_link.name')} style={{ fontSize: '5rem' }} />
      <EmailAddress>{email}</EmailAddress>
      <Desc>{t('auth_providers.magic_link.sent_desc')}</Desc>
    </main>
  )
}

UsersMagicLinkSent.layout = applicationLayout

export { UsersMagicLinkSent }
