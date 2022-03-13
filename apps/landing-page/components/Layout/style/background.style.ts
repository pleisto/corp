import { styled } from '@brickdoc/design-system'

export const Background = styled('div', {
  width: '100%',
  zIndex: -2,
  position: 'absolute',
  left: 0,
  top: 0,
  video: {
    objectFit: 'cover',
    height: 860,
    '@xsDown': {
      height: 560
    }
  }
})

export const TopBg = styled('div', {
  width: '100%',
  zIndex: -1,
  position: 'absolute',
  height: 146,
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)',
  transform: 'matrix(1, 0, 0, -1, 0, 0)'
})

export const BottomBg = styled('div', {
  width: '100%',
  zIndex: -1,
  position: 'absolute',
  left: 0,
  top: 522,
  height: 340,
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)',
  '@xsDown': {
    top: 270,
    height: 292
  }
})
