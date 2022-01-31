import { ForwardRefRenderFunction, forwardRef } from 'react'
import { Spinner as ChakraSpinner, SpinnerProps as ChakraSpinnerProps } from '@chakra-ui/react'

export interface SpinnerProps extends Omit<ChakraSpinnerProps, 'colorScheme' | 'variant'> {}

const Spinner: ForwardRefRenderFunction<HTMLDivElement, SpinnerProps> = (props, ref) => {
  const { color = 'primaryDefault', ...otherProps } = props
  return <ChakraSpinner color={color} ref={ref} {...otherProps} />
}

const _Spinner = forwardRef(Spinner)
_Spinner.displayName = 'Spinner'
export { _Spinner as Spinner }
