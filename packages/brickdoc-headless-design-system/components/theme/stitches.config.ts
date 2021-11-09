import { createStitches } from '@stitches/react'
import { Colors } from './colors'

export const { styled, css, theme } = createStitches({
  prefix: 'brk',
  theme: {
    colors: Colors,
    space: {
      1: '5px',
      2: '10px',
      3: '15px'
    },
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
