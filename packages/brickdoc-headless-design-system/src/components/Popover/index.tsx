import { FC, useRef } from 'react'
import { OverlayTrigger, OverlayTriggerProps, TippyRefElement } from '../Tooltip/OverlayTrigger'
import { theme, css, prefix, styled } from '../../themes'
import { DismissButton } from '@react-aria/overlays'
export interface PopoverProps extends Omit<OverlayTriggerProps, 'overlay'> {
  title?: React.ReactNode
  content: React.ReactNode
}

const popoverStyle = css({
  include: ['refractionPrimary'],
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'center',
  wordBreak: 'break-word',
  backgroundColor: theme.colors.white,
  // borderColor could append to the color of the arrow
  borderColor: theme.colors.white,
  color: theme.colors.typePrimary,
  textDecoration: 'none',
  padding: '12px 20px',
  minHeight: '3rem',
  borderRadius: '2px',
  minWidth: '10rem',
  '& > [data-overlay-arrow]': {
    [`--${prefix}-overlay-arrow-width`]: '8px'
  }
})

const PopoverTitle = styled('div', {
  textAlign: 'left',
  fontWeight: 500,
  padding: '.5rem 0'
})

export const Popover: FC<PopoverProps> = props => {
  const { title, content, trigger = 'click', children, role = 'dialog', overlayClassName, ...otherProps } = props
  const ref = useRef<TippyRefElement>()
  // DismissButton allow screen reader users to dismiss a popover when there is no visual affordance to do so
  const overlay = (
    <div>
      {title && <PopoverTitle>{title}</PopoverTitle>}
      {content}
      <DismissButton onDismiss={() => ref.current?._tippy.hide()} />
    </div>
  )
  return (
    <OverlayTrigger
      overlay={overlay}
      overlayClassName={`${popoverStyle()} ${overlayClassName}`}
      trigger={trigger}
      role={role}
      ref={ref}
      {...otherProps}>
      {children}
    </OverlayTrigger>
  )
}
