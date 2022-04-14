import { theme, styled } from '@brickdoc/design-system'

export const ImageWithSpinWrapper = styled('div', {
  position: 'relative',
  height: '100%',
  width: '100%',
  background: theme.colors.overlaySecondary,

  'img.cover': {
    height: '100%',
    width: '100%'
  },

  '.cover-spin': {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
})
