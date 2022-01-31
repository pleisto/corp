import { createStitches } from '@stitches/react'
import { mixins } from 'stitches-mixins'

/**
 * @deprecated
 * Register default theme here
 */
export const { theme, css, styled, config, globalCss, keyframes, prefix } = createStitches({
  prefix: 'brd',
  theme: {},
  utils: {
    include: mixins({})
  }
})
