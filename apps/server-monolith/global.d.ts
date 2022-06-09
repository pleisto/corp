import type { ReactNode } from 'react'
import type { SharedContextPayload } from './app/frontend/hooks/useSharedContext'

declare global {
  type InertiaFC<P = {}> = React.FC<P & SharedContextPayload> & {
    layout?: (page: ReactNode) => JSX.Element
  }
}
