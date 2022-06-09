import { createContext, Context, useContext } from 'react'

export interface SharedContextPayload {
  csrfToken: string
}

export const SharedContext: Context<SharedContextPayload> = createContext({
  csrfToken: ''
})

SharedContext.displayName = 'BrickdocServerSharedData'

export const useSharedContext = (): SharedContextPayload => useContext(SharedContext)
