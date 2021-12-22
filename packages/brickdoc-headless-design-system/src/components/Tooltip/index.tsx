import { FC } from 'react'
import { OverlayTrigger, OverlayTriggerProps, Trigger } from './OverlayTrigger'
import { theme, css } from '../../themes'

export interface TooltipProps extends Omit<OverlayTriggerProps, 'overlay' | 'overlayClassName'> {
  title: React.ReactNode
}

const tooltipStyle = css({
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'center',
  wordBreak: 'break-word',
  backgroundColor: theme.colors.grey9,
  // borderColor could append to the color of the arrow
  borderColor: theme.colors.grey9,
  color: theme.colors.white,
  textDecoration: 'none',
  padding: '6px 8px',
  textAlign: 'center',
  minHeight: '1.5rem',
  borderRadius: '2px',
  minWidth: '3rem'
})

export const Tooltip: FC<TooltipProps> = props => {
  const {
    title,
    trigger = 'mouseenter focus',
    touch = ['hold', 1000],
    children,
    role = 'tooltip',
    ...otherProps
  } = props
  return (
    <OverlayTrigger
      overlay={title}
      overlayClassName={tooltipStyle()}
      touch={touch}
      trigger={trigger}
      role={role}
      {...otherProps}>
      {children}
    </OverlayTrigger>
  )
}

export type { Trigger }
export type { Placement } from 'tippy.js'
