import { FC, useRef } from 'react'
import { useButton } from '@react-aria/button'
import { noop } from 'lodash-es'
import { styled } from '../theme'
import { variants, baseStyles } from './style'

export type HtmlType = 'button' | 'reset' | 'submit'
export type Size = 'default' | 'small' | 'large'
export type Priority = 'primary' | 'secondary' | 'ghost' | 'danger'

export interface ButtonProps {
  block?: boolean
  circle?: boolean
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
  htmlType?: HtmlType
  size?: Size
  style?: React.CSSProperties
  prefixCls?: string
  priority?: Priority
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>
}

const Button: FC<ButtonProps> = props => {
  const {
    disabled = false,
    // loading = false,
    // prefixCls: customizePrefixCls,
    priority = 'primary',
    size = 'default',
    onClick = noop,
    onMouseDown = noop,
    className = '',
    children,
    // icon,
    block = false,
    // htmlType = 'button' as ButtonProps['htmlType'],
    ...rest
  } = props

  const ref = useRef()
  const { buttonProps } = useButton(props, ref)
  const Button = styled('button', {
    ...baseStyles,
    variants,
    defaultVariants: {
      priority,
      size,
      state: block && 'block'
    }
  })

  return (
    <Button {...buttonProps} {...rest} ref={ref} disabled={disabled} onClick={onClick} className={className} onMouseDown={onMouseDown}>
      {children}
    </Button>
  )
}

export default Button
