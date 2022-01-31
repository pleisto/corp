import { cssVar, SystemStyleObject } from '../../../utilities'

const $size = cssVar('spinner-size')

const baseStyle: SystemStyleObject = {
  width: [$size.reference],
  height: [$size.reference]
}

const sizes: Record<string, SystemStyleObject> = {
  xs: {
    [$size.variable]: '0.75rem'
  },
  sm: {
    [$size.variable]: '1rem'
  },
  md: {
    [$size.variable]: '1.5rem'
  },
  lg: {
    [$size.variable]: '2rem'
  },
  xl: {
    [$size.variable]: '3rem'
  }
}

const defaultProps = {
  size: 'md'
}

export const Spinner = {
  baseStyle,
  sizes,
  defaultProps
}
