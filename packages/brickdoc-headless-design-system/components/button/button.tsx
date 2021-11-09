import React, { useRef } from 'react'
import { useButton } from '@react-aria/button'
import { css } from '../theme'

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

  const demoBtn = css({
    backgroundColor: '$grey-2',
    borderRadius: '9999px',
    fontSize: '13px',
    padding: '10px 15px',
    '&:hover': {
      backgroundColor: 'lightgray'
    }
  })

  return (
    <button className={demoBtn()} {...buttonProps} ref={ref}>
      {props.children}
    </button>
  )
}

export default Button
