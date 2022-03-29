import { FC, ReactNode } from 'react'
import { Tippy, TippyProps } from './tippy/Tippy'
import defaults from 'lodash/defaults'
import 'tippy.js/animations/scale.css'

/**
 * A subset of `TippyProps` to constraint the component's behavior.
 */
type AllowedTippyProps = Omit<
  TippyProps,
  'content' | 'arrow' | 'moveTransition' | 'popperOptions' | 'role' | 'triggerTarget'
>

/**
 * The `Tooltip` component is based on Tippy.js. Please refer to
 * [Tippy.js official documentation](https://atomiks.github.io/tippyjs/v6/all-props/)
 * for more information about the details of the supported props except `children` and `title`.
 */
export interface TooltipProps extends AllowedTippyProps {
  /** The content of the tooltip. */
  title?: ReactNode
}

const DEFAULT_PROPS: Partial<TooltipProps> = {
  animation: 'scale',
  duration: 200
}

export const Tooltip: FC<TooltipProps> = ({ children, title, ...restProps }: TooltipProps) => {
  const tippyProps = defaults(restProps, DEFAULT_PROPS)
  return (
    <Tippy content={title} role="tooltip" arrow {...tippyProps}>
      {children}
    </Tippy>
  )
}
