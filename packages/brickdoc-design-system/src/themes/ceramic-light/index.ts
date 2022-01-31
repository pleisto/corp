import { colors, breakpoints, radii, spacing, transitions, typography, zIndices, semanticTokens } from './foundations'
import * as components from './components'
import { globalStyle } from './globalStyle.style'
import { prefix } from '../common'

export const ceramicLight = {
  direction: 'ltr',
  colors,
  semanticTokens,
  breakpoints,
  radii,
  space: spacing,
  transitions,
  ...typography,
  zIndices,
  components,
  styles: {
    global: globalStyle
  },
  config: {
    cssVarPrefix: prefix,
    initialColorMode: 'light',
    useSystemColorMode: false
  }
}

// for chakra ui
// eslint-disable-next-line import/no-default-export
export default ceramicLight
