import { FC, useRef, useEffect, useState } from 'react'
import { useButton } from '@react-aria/button'
import { noop } from 'lodash-es'
import LoadingIcon from './LoadingIcon'
import { styled } from '../theme'
import { variants, baseStyles } from './style'

export type HtmlType = 'button' | 'reset' | 'submit'
export type Size = 'default' | 'sm' | 'lg'
export type Priority = 'primary' | 'secondary' | 'ghost' | 'danger'

export interface ButtonProps {
  block?: boolean
  circle?: boolean
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean | { delay?: number }
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

type Loading = number | boolean

const Button: FC<ButtonProps> = props => {
  const {
    disabled = false,
    loading = false,
    circle = false,
    // prefixCls: customizePrefixCls,
    priority = 'primary',
    size = 'md',
    onClick = noop,
    onMouseDown = noop,
    className = '',
    children,
    icon,
    block = false,
    // htmlType = 'button' as ButtonProps['htmlType'],
    ...rest
  } = props
  const [innerLoading, setLoading] = useState<Loading>(!!loading)
  const ref = useRef()
  const delayTimeoutRef = useRef<number>()
  const { buttonProps } = useButton(props, ref)

  let loadingOrDelay: Loading
  if (typeof loading === 'object' && loading.delay) {
    loadingOrDelay = loading.delay || true
  } else {
    loadingOrDelay = !!loading
  }
  // =============== Update Loading ===============
  useEffect(() => {
    clearTimeout(delayTimeoutRef.current)
    if (typeof loadingOrDelay === 'number') {
      delayTimeoutRef.current = window.setTimeout(() => {
        setLoading(loadingOrDelay)
      }, loadingOrDelay)
    } else {
      setLoading(loadingOrDelay)
    }
  }, [loadingOrDelay])

  // const iconType = innerLoading ? 'loading' : icon

  const iconNode = icon && !innerLoading ? icon : <LoadingIcon existIcon={!!icon} loading={!!innerLoading} />

  const Button = styled('button', {
    ...baseStyles,
    variants,
    defaultVariants: {
      priority,
      size,
      block,
      circle: circle && size
    }
  })
  const hasChildren = loading ? <></> : children

  return (
    <Button
      {...buttonProps}
      {...rest}
      ref={ref}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      onMouseDown={onMouseDown}
    >
      {iconNode}
      {hasChildren}
    </Button>
  )
}

export default Button
