declare global {
  interface mashcardServerContext {
    internalApiEndpoint: string
    currentUser?: {
      domain: string
    }
    currentSpace: {
      domain: string
    }
    lastBlockIds?: {
      [domain: string]: string
    }
    lastDomain?: string
    env: string
    version: string
    locale: string
    rtl: boolean
    settings: { [key: string]: any }
    features: { [key: string]: any }
    timezone: string
    defaultTimezone: string
    host: string
    selfHost: boolean
    csrfToken: string
    isDesktopApp: boolean
    featureFlags: string[]
    serverMessage: string
    sentryDsn: string
  }
  interface mashcardClientContext {
    wsCable: ActionCable.Consumer
    uuid: string
  }
  type mashcardContext = mashcardServerContext & mashcardClientContext

  // eslint-disable-next-line no-inner-declarations, no-var
  var mashcardContext: mashcardContext
}

export {}
