import { FC } from 'react'
import * as Root from './style/background.style'

export interface BackgroundVideoProps {
  url: string
}

export const Video: FC<BackgroundVideoProps> = ({ url }) => {
  return (
    <>
      <Root.TopBg />
      <Root.Background>
        <video
          autoPlay
          playsInline
          width="100%"
          muted
          loop
          x-webkit-airplay="deny"
          disableRemotePlayback
          preload="auto"
        >
          <source src={url} type="video/mp4" />
        </video>
      </Root.Background>
      <Root.BottomBg />
    </>
  )
}
