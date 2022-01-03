import { forwardRef, ForwardRefRenderFunction, MouseEvent, ReactNode } from 'react'
import { usePress } from '@react-aria/interactions'
import { PressEvent } from '@react-types/shared/src/events'
/* import { Close as CloseOutlined, Plus as PlusOutlined, More as EllipsisOutlined } from '@brickdoc/design-icons' */

import { prefix } from '../../themes'
import { TagRoot } from './styles/index.style'

export interface TagProps {
  // closable?: boolean
  size?: 'sm' | 'lg'
  color?: 'none' | 'primary' | 'red'
  border?: boolean
  prefixCls?: string
  onClick?: (e: MouseEvent<HTMLElement> | PressEvent) => void
  onClose?: (e: MouseEvent<HTMLElement>, value: ReactNode) => void
  children?: ReactNode
}

const Tag: ForwardRefRenderFunction<unknown, TagProps> = (props, ref) => {
  const {
    children,
    // closable = false,
    size = 'md',
    color = 'primary',
    onClick,
    onClose,
    prefixCls,
    ...otherProps
  } = props

  const { pressProps, isPressed } = usePress({
    onPress: e => {
      if (e.type === 'press') {
        onClick?.(e)
      }
    }
  })

  return (
    <>
      <TagRoot color={color} size={size} pressed={isPressed} {...(pressProps as any)} {...otherProps}>
        {children ?? ''}
      </TagRoot>
    </>
  )
}

const _Tag = forwardRef(Tag)

_Tag.displayName = `${prefix}Tag`

export { _Tag as Tag }
