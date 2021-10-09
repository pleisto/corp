import { FC } from 'react'
import { Redirect } from 'react-router-dom'
import { renderRoutes, RouteConfig, RouteConfigComponentProps } from 'react-router-config'
import { PanelLayoutPage } from '@/accounts/modules/common/layouts/PanelLayoutPage'
import { SignInPage } from '@/accounts/modules/sessions/SignInPage'
import { SignUpPage } from '@/accounts/modules/sessions/SignUpPage'
import { EditPasswordPage } from '@/accounts/modules/passwords/EditPasswordPage'
import { ForgetPasswordPage } from '@/accounts/modules/passwords/ForgetPasswordPage'
import { DocumentContent } from '@/docs/modules/pages/DocumentContent'

interface routeRule extends RouteConfig {
  beforeAction?: FC<RouteConfigComponentProps> | undefined
  routes?: routeRule[]
}

const generateRouteConfig = (rules: routeRule[]): RouteConfig[] => {
  return rules.map(rule => {
    // recursive sub-routes
    if (rule.routes) rule.routes = generateRouteConfig(rule.routes)

    // replace render with beforeAction if exists
    if (typeof rule.beforeAction === 'function') {
      rule.render = rule.beforeAction
      rule.component = undefined
    }
    return rule
  })
}

export const routeConfig = (context: BrickdocContext): JSX.Element => {
  const { webid } = context.currentPod
  const redirectToLogin: FC<RouteConfigComponentProps> = () => <Redirect to="/accounts/sign_in" />
  const redirectToHome: FC<RouteConfigComponentProps> = () => <Redirect to={`/${webid}`} />
  const authenticateUser = context.currentUser ? undefined : redirectToLogin
  const rules: routeRule[] = [
    {
      path: '/',
      exact: true,
      beforeAction: authenticateUser,
      render: redirectToHome
    },
    // Accounts
    {
      path: '/accounts',
      component: PanelLayoutPage,
      // require user to be unauthenticated
      beforeAction: context.currentUser ? redirectToHome : undefined,
      routes: [
        {
          path: '/accounts/sign_in',
          component: SignInPage
        },
        {
          path: '/accounts/sign_up',
          component: SignUpPage
        },
        {
          path: '/accounts/password/forget',
          component: ForgetPasswordPage
        },
        {
          path: '/accounts/password/edit',
          component: EditPasswordPage
        }
      ]
    },
    // Docs

    {
      path: '/:webid/p/:docid',
      exact: true,
      beforeAction: authenticateUser,
      component: DocumentContent
    },
    {
      path: '/:webid/p/:docid/s/:snapshotVersion',
      exact: true,
      beforeAction: authenticateUser,
      component: DocumentContent
    },
    {
      path: '/:webid/p/:docid/l/:shareLink',
      exact: true,
      component: DocumentContent
    },
    {
      path: '/:webid',
      exact: true,
      beforeAction: authenticateUser,
      component: DocumentContent
    }
  ]
  return renderRoutes(generateRouteConfig(rules))
}
