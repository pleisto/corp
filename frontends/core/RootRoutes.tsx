import { FC, lazy, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { BrickdocContext } from '@/common/brickdocContext'

const AccountsModule = lazy(async () => await import('@/accounts/Module'))

export const RootRoutes: FC = () => {
  const context = useContext(BrickdocContext)
  const rootPath = context.lastBlockId ? `/${context.lastWebid}/${context.lastBlockId}` : `/${context.currentPod.webid}`
  return (<Router>
    <Routes>
      <Route path="accounts/*" element={<AccountsModule />} />
      <Route path="/" element={<Navigate replace to={rootPath} />} />
    </Routes>
  </Router>)
}