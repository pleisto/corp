import { styled, theme } from '@brickdoc/design-system'

export const Title = styled('div', {
  color: theme.colors.typePrimary,
  width: 364,
  h1: {
    fontSize: theme.fontSizes.largeTitle,
    lineHeight: theme.lineHeights.largeTitle,
    margin: 0,
    fontWeight: 700
  },
  h2: {
    fontSize: theme.fontSizes.title4,
    lineHeight: '2rem',
    margin: 0,
    fontWeight: 600,
    marginBottom: 16
  },
  p: {
    color: theme.colors.typeSecondary,
    fontSize: theme.fontSizes.title4,
    fontWeight: 450,
    lineHeight: '2rem',
    marginBottom: '36px'
  },
  '@xsDown': {
    textAlign: 'center',
    width: '100%',

    h1: {
      fontSize: theme.fontSizes.title2,
      lineHeight: theme.lineHeights.title2,
      fontWeight: 600
    },
    h2: {
      fontSize: theme.fontSizes.body,
      lineHeight: theme.lineHeights.title5,
      margin: 0,
      fontWeight: 600,
      marginBottom: 8
    },
    p: {
      fontSize: theme.fontSizes.body,
      lineHeight: theme.lineHeights.title5,
      marginBottom: '1rem',
      textAlign: 'left',
      br: {
        display: 'none'
      }
    }
  }
})

export const Content = styled('div', {
  '@xsDown': {
    display: 'none'
  }
})

export const ContentSm = styled('div', {
  margin: '0 -20px',
  '@xsUp': {
    display: 'none'
  }
})

export const ItemCard = styled('div', {
  display: 'flex',
  width: '100%',
  height: 640,
  padding: '82px 60px',
  paddingBottom: 0,
  marginBottom: 48,
  borderRadius: 8,
  justifyContent: 'space-between',
  '&:last-child': {
    marginBottom: 0
  },
  '@mdOnly': {
    padding: '82px 50px',
    marginBottom: 40
  },
  '@xsDown': {
    height: 'unset',
    padding: '40px 20px',
    paddingBottom: 0,
    flexDirection: 'column',
    marginBottom: 24
  },
  variants: {
    color: {
      green: {
        background: theme.colors.green1
      },
      blue: {
        background: theme.colors.blue1
      },
      cyan: {
        background: theme.colors.cyan1
      },
      orange: {
        background: theme.colors.orange1
      }
    },
    direcTion: {
      ltr: {
        paddingRight: 0,
        '@xsDown': {
          paddingRight: 20
        }
      },
      rtl: {
        paddingLeft: 0,
        '@xsDown': {
          paddingLeft: 20
        }
      }
    }
  }
})
