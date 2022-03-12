import { styled, theme } from '@brickdoc/design-system'

export const Body = styled('article', {
  width: '1040px',
  margin: 'auto',
  paddingBottom: 120,
  p: {
    fontSize: theme.fontSizes.title4,
    lineHeight: '34px',
    marginBottom: '24px',
    color: theme.colors.typeSecondary
  },
  h3: {
    fontSize: theme.fontSizes.title3,
    lineHeight: '36px',
    marginBottom: '24px',
    color: theme.colors.typePrimary,
    fontWeight: 600
  },
  h4: {
    fontSize: theme.fontSizes.title3,
    lineHeight: '36px',
    marginBottom: '48px',
    color: theme.colors.typePrimary,
    fontWeight: 600
  },
  '@mdOnly': {
    width: '1008px'
  },
  '@xsDown': {
    width: '100%',
    minWidth: '375px',
    padding: '0 36px',
    p: {
      fontSize: theme.fontSizes.body,
      lineHeight: theme.lineHeights.title5,
      marginBottom: '1rem'
    }
  }
})

export const Gallery = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 120,
  '@xsDown': {
    width: '100%',
    minWidth: 375,
    padding: '0 36px'
  }
})

export const GalleryHead = styled('h3', {
  display: 'flex',
  fontSize: theme.fontSizes.title3,
  lineHeight: theme.lineHeights.title3,
  fontWeight: 600,
  justifyContent: 'center',
  marginBottom: 48,
  '@xsDown': {
    fontSize: theme.fontSizes.title5,
    lineHeight: theme.lineHeights.title5
  }
})

export const GalleryBody = styled('div', {
  display: 'flex',
  height: 56,
  img: {
    height: 56,
    objectFit: 'scale-down'
  },
  '@xsDown': {
    height: 36,
    img: {
      height: 36,
      marginRight: 36
    }
  }
})
