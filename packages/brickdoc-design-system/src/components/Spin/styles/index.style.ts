import { css } from '../../../themes'

export const spinStyle = css({
  position: 'relative',
  opacity: 0,
  transform: 'scale(3)',
  marginLeft: '20px',
  marginTop: '10px',

  variants: {
    size: {
      sm: {},
      md: {},
      lg: {}
    }
  }
})
