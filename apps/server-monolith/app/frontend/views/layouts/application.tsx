import { FC, ReactNode, useEffect } from 'react'
import { Provider, globalStyle, styled, theme, toast } from '@brickdoc/design-system'
import { usePage } from '@inertiajs/inertia-react'
import { SharedContext } from '../../hooks/useSharedContext'
import ceramicBackground from '@brickdoc/client-web/src/common/assets/ceramicBg.webp'
import Logo from '@brickdoc/client-web/src/common/assets/logo_brickdoc.svg'

interface Props {
  children: ReactNode
}

const panelCardEl = 'main#panel-card'
const Layout = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  justifyContent: 'flex-start',
  header: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '1.5rem 2rem',
    a: {
      marginRight: '2rem'
    },
    'a img': {
      height: '2.5rem'
    }
  },
  [panelCardEl]: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    h1: {
      paddingTop: 0,
      lineHeight: '1.875rem',
      fontSize: '1.375rem'
    }
  },
  variants: {
    theme: {
      fluid: {
        backgroundColor: theme.colors.ceramicPrimary,
        header: {
          justifyContent: 'center'
        },
        [panelCardEl]: {
          width: '100%',
          padding: '2rem'
        }
      },
      ceramic: {
        background: `url(${ceramicBackground}) no-repeat fixed center center`,
        backgroundSize: 'cover',
        backgroundClip: 'border-box',
        header: {
          justifyContent: 'space-between',
          position: 'absolute'
        },
        [panelCardEl]: {
          include: ['ceramicPrimary'],
          borderRadius: '0.5rem',
          width: '34rem',
          marginTop: 'auto',
          padding: '5rem 5rem 3rem 5rem',
          marginBottom: 'auto'
        }
      }
    }
  }
})

export const Application: FC<Props> = ({ children }) => {
  // Inject global styles
  globalStyle()

  const { csrfToken, flash } = usePage().props as unknown as {
    csrfToken: string
    flash: {
      success: string | null
      alert: string | null
      notice: string | null
    }
  }

  useEffect(() => {
    if (flash.success) toast.success(flash.success)
    if (flash.notice) toast.info(flash.notice)
    if (flash.alert) toast.notification('Error', flash.alert, { type: 'error' })
  }, [flash])

  return (
    <SharedContext.Provider value={{ csrfToken }}>
      <Provider>
        <Layout
          theme={{
            '@smDown': 'fluid',
            '@smUp': 'ceramic'
          }}>
          <header>
            <a href="/">
              <img src={Logo} alt="Brickdoc" />
            </a>
          </header>
          {children}
        </Layout>
      </Provider>
    </SharedContext.Provider>
  )
}

/**
 * set up the application
 */
export const applicationLayout = (page: ReactNode): JSX.Element => <Application children={page} />
