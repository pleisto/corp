import React, { Suspense, useContext } from 'react'
import { ApolloProvider } from '@apollo/client'
import { Spin, ConfigProvider } from '@brickdoc/design-system'
import { HelmetProvider } from 'react-helmet-async'
import { apolloClient } from '@/common/apollo'
import { InMemoryCacheConfig } from '@apollo/client/cache/inmemory/inMemoryCache'

interface globalContext {
  internalApiEndpoint: string
  env: string
  version: string
  locale: string
  rtl: boolean
  currentUser?: {
    webid: string
    avatar: string
    name: string
  }
  timezone: string
  selfHost: boolean
  csrfToken: string
  isDesktopApp: boolean
  featureFlags: string[]
  serverMessage: string
  settings: {
    [scope: string]: {
      [key: string]: any
    }
  }
}

export const BrickdocContext: React.Context<globalContext> = React.createContext(globalThis.brickdocContext)
BrickdocContext.displayName = 'BrickdocGlobalConfig'

export const useBrickdocSetting: any = (key, scope = '') => {
  const { settings } = useContext(BrickdocContext)
  if (!settings[scope]) return null
  return settings[scope][key]
}

const direction = globalThis.brickdocContext.rtl ? 'rtl' : 'ltr'

interface ProviderInterface {
  cacheConfig?: InMemoryCacheConfig
}

const PWAProvider: React.FC<ProviderInterface> = props => {
  return (
    <Suspense fallback={<Spin delay={1000} />}>
      <ConfigProvider direction={direction} i18n={globalThis.i18n}>
        <ApolloProvider client={apolloClient(props.cacheConfig)}>
          <HelmetProvider>{props.children}</HelmetProvider>
        </ApolloProvider>
      </ConfigProvider>
    </Suspense>
  )
}
export default PWAProvider
