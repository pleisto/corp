import { forwardRef, ForwardRefRenderFunction, useCallback } from 'react'
import { usePress } from '@react-aria/interactions'
import { Close as CloseOutlined } from '@brickdoc/design-icons'

import type { TagProps } from './constants'
import { prefix } from '../../themes'
import { TagRoot } from './styles/index.style'

const Tag: ForwardRefRenderFunction<unknown, TagProps> = (props, ref) => {
  const {
    children,
    closable = false,
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
  const handleClose = useCallback(
    e => {
      // TODO: change value
      onClose?.(e, 'text')
    },
    [onClose]
  )

  const icon = closable ? <CloseOutlined onClick={handleClose} /> : <></>

  return (
    <>
      <TagRoot ref={ref} color={color} size={size} pressed={isPressed} {...(pressProps as any)} {...otherProps}>
        {children ?? ''}
        {icon}
      </TagRoot>
    </>
  )
}

const _Tag = forwardRef(Tag)

_Tag.displayName = `${prefix}Tag`

export { _Tag as Tag }
