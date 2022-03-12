import type { AppProps } from 'next/app'
import Head from 'next/head'
import { globalStyle, globalCss } from '@brickdoc/design-system'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <style id="stitches" dangerouslySetInnerHTML={{ __html: globalStyle() }} />
        <style
          id="stitchesOverflow"
          dangerouslySetInnerHTML={{
            __html: globalCss({
              body: {
                background: '#fff'
              }
            }) as string
          }}
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
