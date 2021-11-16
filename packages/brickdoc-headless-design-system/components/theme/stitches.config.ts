import { createStitches } from '@stitches/react'
import { Colors } from './colors'
import { Spacing } from './spacing'

export const { styled, css, theme } = createStitches({
  prefix: 'bd',
  theme: {
    colors: Colors,
    space: Spacing,
    fontSizes: {
      1: '12px',
      2: '13px',
      3: '15px'
    },
    fonts: {
      untitled: 'Untitled Sans, apple-system, sans-serif',
      mono: 'Söhne Mono, menlo, monospace'
    },
    fontWeights: {},
    lineHeights: {},
    letterSpacings: {},
    sizes: {},
    borderWidths: {},
    borderStyles: {},
    radii: {},
    shadows: {},
    zIndices: {},
    transitions: {}
  }
})
