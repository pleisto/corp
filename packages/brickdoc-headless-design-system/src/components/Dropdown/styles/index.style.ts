import { theme, css } from '../../../themes'

export const dropdownStyle = css({
  position: 'absolute',
  top: '-9999px',
  left: '-9999px',
  zIndex: theme.zIndices.dropdown,
  display: 'block',
  '&-hidden': {
    display: 'none'
  },
  '&::before': {
    position: 'absolute',
    top: '-4px',
    right: 0,
    bottom: '-4px',
    left: '-7px',
    zIndex: -9999,
    opacity: 0.00001,
    content: ' '
  }
})
