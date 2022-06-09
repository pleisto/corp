import { ReactNode } from 'react'
import { styled, Divider } from '@brickdoc/design-system'
import { partition } from '@brickdoc/active-support'
import { applicationLayout } from '../layouts/application'
import { useI18n } from '../../hooks'
import { SocialLoginButton } from '../../components/sessions/SocialLoginButton'
import { PasswordAuth } from '../../components/sessions/PasswordAuth'
import { MagicLinkAuth } from '../../components/sessions/MagicLinkAuth'

interface AuthProvider {
  id: string
  logo: string
  preferred: boolean
}

const SessionsNew: InertiaFC<{ providers: AuthProvider[]; signUpEnabled: boolean; currentProvider?: string }> = ({
  providers,
  signUpEnabled,
  currentProvider
}) => {
  const { t } = useI18n()

  // Partition providers into preferred and other
  let [preferredProviders, otherProviders] = partition(providers, 'preferred')

  // When currentProvider is set, it will be used to override the panel,
  // and other providers will be shown as more login options.
  const current = providers.find(provider => provider.id === currentProvider)
  if (current) {
    preferredProviders = [
      {
        ...current,
        preferred: true
      }
    ]
    otherProviders = providers
      .filter(provider => provider.id !== currentProvider)
      .map(p => ({ ...p, preferred: false }))
  }

  // Load auth provider components by id
  // @param props AuthProvider props
  // @param key? key for render list component
  const providerLoader = ({ id, logo, preferred }: AuthProvider, key?: string): ReactNode => {
    switch (id) {
      case 'password':
        return <PasswordAuth signUpEnabled={signUpEnabled} preferred={preferred} key={key} />
      case 'magic_link':
        return (
          <MagicLinkAuth
            hasDivider={
              // Show divider if magic link is preferred but it is not the first provider
              preferredProviders.length > 1 && preferredProviders[0].id !== id
            }
            preferred={preferred}
            key={key}
          />
        )
      default:
        return (
          <SocialLoginButton
            id={id}
            key={key}
            logo={logo}
            preferred={preferred}
            name={t(`auth_providers.${id}.name`)}
          />
        )
    }
  }

  return (
    <main id="panel-card">
      <PreferredAuthMethods>
        <h1>{t('sign_in.heading')}</h1>
        <nav>{preferredProviders.map(p => providerLoader(p, p.id))}</nav>
      </PreferredAuthMethods>
      {otherProviders.length > 0 && (
        <MoreAuthMethods>
          <Divider>{t('sign_in.more_login_options')}</Divider>
          <nav>{otherProviders.map(p => providerLoader(p, p.id))}</nav>
        </MoreAuthMethods>
      )}
    </main>
  )
}

const PreferredAuthMethods = styled('div', {
  '& > nav': {
    marginTop: '3rem',
    display: 'flex',
    flexDirection: 'column',
    '& > button': {
      marginBottom: '1.5rem',
      '&:last-child': {
        marginBottom: 0
      }
    }
  }
})

const MoreAuthMethods = styled('div', {
  marginTop: '1.5rem',
  textAlign: 'center',
  'nav > button': {
    marginRight: '1.875rem',
    width: '2rem',
    height: '2rem',
    '& > .brd-icon': {
      fontSize: '1.125rem'
    },
    '& > .brd-icon-img': {
      fontSize: '1.8rem'
    },
    '&:hover, &:active': {
      border: 'none'
    },
    '&:last-child': {
      marginRight: 0
    }
  }
})

SessionsNew.layout = applicationLayout

export { SessionsNew }
