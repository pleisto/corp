import { styled, theme } from '@brickdoc/design-system'

export const Layout = styled('main', {
  width: 1200,
  margin: '0 auto',
  fontFamily: theme.fonts.defaultSans,
  '@mdOnly': {
    width: '100%',
    minWidth: 1008
  },
  '@xsDown': {
    width: '100%',
    minWidth: 375
  }
})
