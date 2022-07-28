import { globalStyle } from '@mashcard/design-system'
import type { AppProps } from 'next/app'
import { FC } from 'react'
import '../styles/globals.css'

globalStyle()

const MyApp: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default MyApp
