import { cssVar as rawCssVar } from '@chakra-ui/theme-tools'
import { prefix } from '../themes/common'

export { chakra as styled } from '@chakra-ui/react'
export type { SystemStyleObject } from '@chakra-ui/theme-tools'

export const cssVar: typeof rawCssVar = (name, options?) =>
  rawCssVar(name, {
    prefix,
    ...options
  })
