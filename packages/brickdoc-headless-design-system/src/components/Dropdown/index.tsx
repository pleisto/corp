import { FC, cloneElement, ReactElement, useRef } from 'react'
import { OverlayTrigger, OverlayTriggerProps, TippyRefElement } from '../Tooltip/OverlayTrigger'
import { useId } from '../../utilities'

export interface DropdownProps extends Omit<OverlayTriggerProps, 'hasArrow|role|overlay'> {
  overlay: ReactElement
}

export const Dropdown: FC<DropdownProps> = props => {
  const triggerId = useId()
  const ref = useRef<TippyRefElement>()
  const {
    overlay,
    trigger = 'click',
    children,
    placement = 'bottom-start',
    overlayClassName,
    onCreate,
    ...otherProps
  } = props

  const overlayElement = cloneElement(overlay, {
    onClose: () => ref.current?._tippy.hide(),
    'aria-labelledby': overlay.props['aria-labelledby'] || triggerId
  })

  return (
    <OverlayTrigger
      ref={ref}
      hasArrow={false}
      role="menu"
      placement={placement}
      overlay={overlayElement}
      overlayClassName={`${overlayClassName}`}
      trigger={trigger}
      {...otherProps}>
      {cloneElement(children, {
        id: triggerId
      })}
    </OverlayTrigger>
  )
}
