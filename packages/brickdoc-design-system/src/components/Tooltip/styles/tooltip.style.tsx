import { globalCss } from '@stitches/react'
import { theme } from '../../../themes'

const bgColor = theme.colors.backgroundOverlayQuaternary
// The arrow size, according the the design, is roughly 5x5
// whereas tippy's default arrow is 8x8
const arrowScale = 5 / 8

export const tooltipStyle = globalCss({
  '.tippy-box[data-theme~="tooltip"]': {
    background: bgColor,
    color: theme.colors.white,
    borderRadius: theme.space.xxs,
    fontSize: theme.fontSizes.callout,
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
