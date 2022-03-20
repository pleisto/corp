import { styled, theme, Button } from '@brickdoc/design-system'

export const Layout = styled('main', {
  width: 1200,
  margin: '0 auto'
})

export const Nav = styled('nav', {
  display: 'flex',
  width: '100%',
  height: 146,
  paddingTop: 40,
  background: 'transparent',
  justifyContent: 'center'
})

export const Content = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  height: 78
})

export const Logo = styled('img', {
  width: 156,
  height: 78,
  objectFit: 'unset'
})

export const Links = styled('div', {
  display: 'flex',
  alignItems: 'center'
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
