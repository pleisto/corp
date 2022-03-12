import { styled, theme } from '@brickdoc/design-system'

export const Footer = styled('footer', {
  background: theme.colors.ceramicSecondary,
  width: '1040px',
  margin: 'auto',
  paddingBottom: 120,
  '@mdOnly': {
    width: '1008px'
  },
  '@xsDown': {
    height: 'unset'
  }
})
