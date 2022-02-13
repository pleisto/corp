import { theme, styled } from '@brickdoc/design-system'

export const List = styled('ul', {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  marginTop: 16
})

export const Item = styled('li', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  '&:hover, &:active': {
    backgroundColor: 'rgb(0 0 0 / 0.05)'
  }
})

export const NotFound = styled('p', {
  color: '#bfbcc6',
  fontSize: theme.fontSizes.subHeadline,
  margin: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%'
})
