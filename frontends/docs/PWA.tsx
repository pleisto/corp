import React, { useContext } from 'react'
import PWAProvider, { BrickdocContext } from '@/common/PWAProvider'
import { BrowserRouter as Router } from 'react-router-dom'
import renderRoutes from './config/routes'
import { SidebarLayoutPage } from '@/docs/modules/common/layouts/SidebarLayoutPage'

const DocsPWA = () => {
  const { currentPod } = useContext(BrickdocContext)

  return (
    <Router>
      <SidebarLayoutPage currentUserWebid={currentPod.webid}>{renderRoutes(currentPod.webid)}</SidebarLayoutPage>
    </Router>
  )
}

export default (
  <PWAProvider>
    <DocsPWA />
  </PWAProvider>
)
