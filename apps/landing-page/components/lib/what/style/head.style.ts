import { styled, theme } from '@brickdoc/design-system'

export const Head = styled('header', {
  justifyContent: 'center',
  flexDirection: 'column',
  margin: '0 auto',
  width: 1040,
  height: 720,
  paddingTop: 118,
  color: theme.colors.typePrimary,
  '@xsDown': {
    width: '100%',
    minWidth: 375,
    height: 560,
    padding: '0 36px',
    paddingTop: 170
  }
})

export const Title = styled('h1', {
  display: 'flex',
  fontSize: theme.fontSizes.superTitle,
  lineHeight: '90px',
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: 56,
  '@xsDown': {
    fontSize: theme.fontSizes.title1,
    lineHeight: '42px',
    marginBottom: 16
  }
})

export const Des = styled('p', {
  display: 'flex',
  fontSize: theme.fontSizes.title3,
  lineHeight: '38px',
  fontWeight: 450,
  '@xsDown': {
    fontSize: theme.fontSizes.title5,
    lineHeight: '30px'
  }
})
