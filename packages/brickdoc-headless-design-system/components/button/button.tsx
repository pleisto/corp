import React, { useRef } from 'react'
import { useButton } from '@react-aria/button'
import { styled } from '../theme'
import { variants } from './style/button'

export type HtmlType = 'button' | 'reset' | 'submit'
export type Size = 'default' | 'small' | 'large'
export type Theme = 'solid' | 'borderless' | 'light'
export type Type = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger'

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
  theme?: Theme
  type?: Type
  prefixCls?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>
}

const Button = props => {
  const ref = useRef()
  const { buttonProps } = useButton(props, ref)
  const Button = styled('button', {
    variants,
    defaultVariants: {
      type: 'primary'
    }
  })

  return (
    <Button {...buttonProps} ref={ref}>
      {props.children}
    </Button>
  )
}

export default Button
