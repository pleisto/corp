/* eslint-disable react/button-has-type */
import * as React from 'react'
import classNames from 'classnames'
import omit from 'rc-util/lib/omit'

import Group from './button-group'
import { ConfigContext } from '../config-provider'
import { tuple } from '../utils/type'
import devWarning from '../utils/devWarning'
import SizeContext, { SizeType } from '../config-provider/SizeContext'
import LoadingIcon from './LoadingIcon'

const ButtonTypes = tuple('default', 'primary', 'link', 'text')
export type ButtonType = typeof ButtonTypes[number]
const ButtonShapes = tuple('circle')
export type ButtonShape = typeof ButtonShapes[number]
const ButtonHTMLTypes = tuple('submit', 'button', 'reset')
export type ButtonHTMLType = typeof ButtonHTMLTypes[number]

export interface BaseButtonProps {
  type?: ButtonType
  icon?: React.ReactNode
  shape?: ButtonShape
  size?: SizeType
  loading?: boolean | { delay?: number }
  prefixCls?: string
  className?: string
  block?: boolean
  children?: React.ReactNode
}

// Typescript will make optional not optional if use Pick with union.
// Should change to `AnchorButtonProps | NativeButtonProps` and `any` to `HTMLAnchorElement | HTMLButtonElement` if it fixed.
// ref: https://github.com/ant-design/ant-design/issues/15930
export type AnchorButtonProps = {
  href: string
  target?: string
  onClick?: React.MouseEventHandler<HTMLElement>
} & BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<any>, 'type' | 'onClick'>

export type NativeButtonProps = {
  htmlType?: ButtonHTMLType
  onClick?: React.MouseEventHandler<HTMLElement>
} & BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>

export interface CompoundedComponent extends React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLElement>> {
  Group: typeof Group
  __ANT_BUTTON: boolean
}

type Loading = number | boolean

const InternalButton: React.ForwardRefRenderFunction<unknown, ButtonProps> = (props, ref) => {
  const {
    loading = false,
    prefixCls: customizePrefixCls,
    type,
    shape,
    size: customizeSize,
    className,
    children,
    icon,
    block = false,
    /** If we extract items here, we don't need use omit.js */
    // React does not recognize the `htmlType` prop on a DOM element. Here we pick it out of `rest`.
    htmlType = 'button' as ButtonProps['htmlType'],
    ...rest
  } = props

  const size = React.useContext(SizeContext)
  const [innerLoading, setLoading] = React.useState<Loading>(!!loading)
  const { getPrefixCls } = React.useContext(ConfigContext)
  const buttonRef = (ref as any) || React.createRef<HTMLElement>()
  const delayTimeoutRef = React.useRef<number>()

  // =============== Update Loading ===============
  let loadingOrDelay: Loading
  if (typeof loading === 'object' && loading.delay) {
    loadingOrDelay = loading.delay || true
  } else {
    loadingOrDelay = !!loading
  }

  React.useEffect(() => {
    clearTimeout(delayTimeoutRef.current)
    if (typeof loadingOrDelay === 'number') {
      delayTimeoutRef.current = window.setTimeout(() => {
        setLoading(loadingOrDelay)
      }, loadingOrDelay)
    } else {
      setLoading(loadingOrDelay)
    }
  }, [loadingOrDelay])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    const { onClick, disabled } = props
    // https://github.com/ant-design/ant-design/issues/30207
    if (innerLoading || disabled) {
      e.preventDefault()
      return
    }
    ;(onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)?.(e)
  }

  devWarning(
    !(typeof icon === 'string' && icon.length > 2),
    'Button',
    `\`icon\` is using ReactNode instead of string naming in v4. Please check \`${icon as string}\` at https://ant.design/components/icon`
  )

  const prefixCls = getPrefixCls('btn', customizePrefixCls)

  // large => lg
  // small => sm
  let sizeCls = ''
  switch (customizeSize || size) {
    case 'large':
      sizeCls = 'lg'
      break
    case 'small':
      sizeCls = 'sm'
      break
    default:
      break
  }

  const iconType = innerLoading ? 'loading' : icon

  const classes = classNames(
    prefixCls,
    {
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${shape}`]: shape,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
      [`${prefixCls}-loading`]: innerLoading,
      [`${prefixCls}-block`]: block
    },
    className
  )

  const iconNode = icon && !innerLoading ? icon : <LoadingIcon existIcon={!!icon} prefixCls={prefixCls} loading={!!innerLoading} />

  const kids = children || children === 0 ? children : null

  const linkButtonRestProps = omit(rest as AnchorButtonProps & { navigate: any }, ['navigate'])
  if (linkButtonRestProps.href !== undefined) {
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <a {...linkButtonRestProps} className={classes} onClick={handleClick} ref={buttonRef}>
        {iconNode}
        {kids}
      </a>
    )
  }

  const buttonNode = (
    <button {...(rest as NativeButtonProps)} type={htmlType} className={classes} onClick={handleClick} ref={buttonRef}>
      {iconNode}
      {kids}
    </button>
  )

  return buttonNode
}

const Button = React.forwardRef<unknown, ButtonProps>(InternalButton) as CompoundedComponent

Button.displayName = 'Button'

Button.Group = Group
Button.__ANT_BUTTON = true

export default Button
