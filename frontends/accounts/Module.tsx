import { BrickdocContext } from '@/common/brickdocContext'
import { FC, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PanelLayoutPage } from './common/layouts/PanelLayoutPage'
import { SignInPage } from './sessions/SignInPage'
import { SignUpPage } from './sessions/SignUpPage'
import { EditPasswordPage } from './passwords/EditPasswordPage'
import { ForgetPasswordPage } from './passwords/ForgetPasswordPage'


const AccountsModule: FC = () => {
  const context = useContext(BrickdocContext)

  if (context.currentUser) return <Navigate replace to="/" />
  
  return (
    <PanelLayoutPage>
      <Routes>
        <Route path="sign_in" element={<SignInPage />} />
        <Route path="sign_up" element={<SignUpPage />} />
        <Route path="password/forget" element={<ForgetPasswordPage />} />
        <Route path="password/edit" element={<EditPasswordPage />} />
        {/* <Route path="*" element={404} /> */}
      </Routes>
    </PanelLayoutPage>
  )
 }

export default AccountsModule