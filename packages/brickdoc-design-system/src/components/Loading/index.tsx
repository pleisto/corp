import React from 'react'
import mp4Url from './assets/loading.mp4'
import { styled } from '../../utilities'

export interface LoadingProps {
  delayDuration?: number
  className?: string
}

const Launcher = styled('div', {
  baseStyle: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey.0'
  }
})

export const Loading: React.FC<LoadingProps> = ({ delayDuration, className }) => {
  return (
    <Launcher role="alert" aria-live="polite" aria-busy={true} aria-label="Loading" className={className}>
      <video
        autoPlay
        playsInline
        width={75}
        height={120}
        muted
        loop
        x-webkit-airplay="deny"
        disableRemotePlayback
        preload="auto">
        <source src={mp4Url} type="video/mp4" />
      </video>
    </Launcher>
  )
}
