import { globalCss } from '@stitches/react'
import { theme } from '../../../themes'
import 'tippy.js/dist/tippy.css'

const bgColor = theme.colors.backgroundOverlayQuaternary
// The arrow size, according the the design, is roughly 5x5
// whereas tippy's default arrow is 8x8
const arrowScale = 5 / 8

export const tippyStyle = globalCss({
  '.tippy-box': {
    background: bgColor,
    color: theme.colors.white,
    borderRadius: theme.space.xxs,
    '& > .tippy-content': {
      padding: `${theme.space.xxs} ${theme.space.sm}`
    },
    '& > .tippy-arrow::before': {
      transform: `scale(${arrowScale})`
    },
    '&[data-placement^="top"] > .tippy-arrow::before': {
      borderTopColor: bgColor
    },
    '&[data-placement^="bottom"] > .tippy-arrow::before': {
      borderBottomColor: bgColor
    },
    '&[data-placement^="left"] > .tippy-arrow::before': {
      borderLeftColor: bgColor
    },
    '&[data-placement^="right"] > .tippy-arrow::before': {
      borderRightColor: bgColor
    }
  }
})
