import { styled, theme } from '@brickdoc/design-system'

export const Footer = styled('footer', {
  background: theme.colors.ceramicSecondary,
  width: '100%',
  paddingBottom: 40,
  overflow: 'hidden'
})

export const Col = styled('div', {
  marginRight: 88,
  '&:last-child': {
    marginRight: 0
  }
})

export const Information = styled('p', {
  marginBottom: 24,
  fontSize: theme.fontSizes.title5,
  lineHeight: '33px',
  fontWeight: 600,
  '@xsDown': {
    lineHeight: '30px'
  }
})

export const Copy = styled('p', {
  fontSize: theme.fontSizes.title5,
  lineHeight: '34px',
  fontWeight: 400,
  color: theme.colors.typeSecondary
})

export const List = styled('ul', {
  margin: 0,
  padding: 0,
  listStyle: 'none',
  marginBottom: 40,
  li: {
    paddingLeft: 16
  }
})

export const Arrow = styled('div', {
  width: 0,
  height: 0,
  borderLeft: `4px solid ${theme.colors.typeSecondary}`,
  borderTop: '4px solid transparent',
  borderBottom: '4px solid transparent',
  marginRight: 6
})

export const Title = styled('li', {
  fontSize: theme.fontSizes.title5,
  lineHeight: theme.lineHeights.title5,
  marginBottom: '16px',
  fontWeight: 500
})

export const Item = styled('li', {
  display: 'flex',
  fontWeight: 600,
  fontSize: theme.fontSizes.subHeadline,
  lineHeight: '30px',
  alignItems: 'center'
})

export const Content = styled('div', {
  display: 'flex',
  width: '1167px',
  paddingTop: 81,
  margin: 'auto',
  color: theme.colors.typePrimary,
  justifyContent: 'space-evenly',
  '@mdOnly': {
    width: '1008px'
  },
  '@xsDown': {
    flexDirection: 'column',
    padding: 40,
    paddingBottom: 0,
    width: '100%',
    minWidth: '375px',
    [`& ${List}`]: {
      width: '100%',
      li: {
        paddingLeft: 0
      }
    }
  }
})
