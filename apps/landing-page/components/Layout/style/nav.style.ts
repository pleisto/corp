import { styled, theme, Button, prefix } from '@brickdoc/design-system'

export const Content = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  height: 78,
  '@xsDown': {
    display: 'none'
  }
})

export const Logo = styled('img', {
  width: 156,
  height: 78,
  objectFit: 'unset',
  position: 'relative',
  zIndex: 2
})

export const Links = styled('div', {
  display: 'flex',
  alignItems: 'center',
  '@xsDown': {
    display: 'none'
  }
})

export const Item = styled('a', {
  display: 'flex',
  color: theme.colors.typeSecondary,
  fontSize: theme.fontSizes.title5,
  lineHeight: theme.lineHeights.title5,
  fontWeight: 400,
  marginRight: 72,
  paddingTop: 2,
  paddingBottom: 8,
  borderBottom: `2px solid ${theme.colors.primaryDefault}`
})

export const Btn = styled(Button, {
  marginLeft: 8
})

export const ContentMobile = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 56,
  padding: '0 16px',
  [`.${prefix}-icon`]: {
    color: theme.colors.iconThirdary,
    fontSize: '24px',
    zIndex: 2
  },
  [`${Logo}`]: {
    height: 22,
    width: 93
  },
  '@xsUp': {
    display: 'none'
  }
})

export const Nav = styled('nav', {
  display: 'flex',
  width: '100%',
  height: 146,
  paddingTop: 40,
  background: 'transparent',
  justifyContent: 'center',
  position: 'relative',
  '@xsDown': {
    paddingTop: 0,
    height: 56
  }
})

export const Menu = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: 196,
  paddingTop: 56,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  background: theme.colors.ceramicPrimary,
  paddingLeft: 20,
  position: 'absolute',
  zIndex: 1,
  left: 0,
  top: 0,
  variants: {
    display: {
      true: {
        display: 'flex'
      },
      false: {
        display: 'none'
      }
    }
  }
})

export const Link = styled('a', {
  fontSize: theme.fontSizes.subHeadline,
  lineHeight: '40px',
  color: theme.colors.typeSecondary
})
