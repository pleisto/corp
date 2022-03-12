import { FC, ReactNode } from 'react'
import * as Root from './style/layout.style'

export interface LayoutProps {
  children: ReactNode
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return <Root.Layout>{children}</Root.Layout>
}
