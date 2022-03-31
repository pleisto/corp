import { globalCss } from '@stitches/react'
import { POPPER_ROOT_ATTRIBUTE } from './constants'
import { theme } from '../../../themes'

const ARROW_SIZE = '16px'

export const popperBaseStyle = globalCss({
  [`[${POPPER_ROOT_ATTRIBUTE}]`]: {
    maxWidth: 'calc(100vw - 10px)',

    '& .tippy-box': {
      // Clear native style
      backgroundColor: 'unset',
      color: 'unset',
      fontSize: 'unset',
      lineHeight: 'unset',
      // Brickdoc's
      position: 'relative',
      whiteSpace: 'initial',
      borderRadius: theme.space.xxs,
      outline: 0,
      transitionProperty: 'transform, visibility, opacity',
      '&[data-placement^="top"] > .tippy-arrow': {
        bottom: 0,
        '&::before': {
          bottom: '-7px',
          left: 0,
          borderWidth: '5px 5px 0',
          borderTopColor: 'initial',
          transformOrigin: 'center top'
        }
      },
      '&[data-placement^="bottom"] > .tippy-arrow': {
        top: 0,
        '&::before': {
          top: '-7px',
          left: 0,
          borderWidth: '5px 5px 0',
          borderBottomColor: 'initial',
          transformOrigin: 'center bottom'
        }
      },
      '&[data-placement^="left"] > .tippy-arrow': {
        right: 0,
        '&::before': {
          right: '-7px',
          borderWidth: '5px 0 5px 5px',
          borderLeftColor: 'initial',
          transformOrigin: 'center left'
        }
      },
      '&data-placement^="right" > .tippy-arrow': {
        left: 0,
        '&::before': {
          left: '-7px',
          borderWidth: '5px 5px 5px 0',
          borderRightColor: 'initial',
          transformOrigin: 'center right'
        }
      },
      '&[data-inertia][data-state="visible"]': {
        transitionTimingFunction: 'cubic-bezier(0.54, 1.5, 0.38, 1.11)'
      }
    },
    '& .tippy-arrow': {
      '&': {
        // Clear native style
        color: 'unset',
        // Brickdoc's
        width: ARROW_SIZE,
        height: ARROW_SIZE
      },

      '&::before': {
        content: '',
        position: 'absolute',
        borderColor: 'transparent',
        borderStyle: 'solid'
      }
    },
    '& .tippy-content': {
      // Clear native style
      padding: 'unset',
      // Brickdoc's
      position: 'relative',
      zIndex: 1
    }
  }
})
