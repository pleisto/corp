import { forwardRef, ForwardRefRenderFunction, useState, cloneElement, ReactNode } from 'react'
import Tippy, { TippyProps } from '@tippyjs/react/headless'
import { Instance, Placement } from 'tippy.js'
import { styled, prefix } from '../../themes'

export type Trigger = 'manual' | 'mouseenter focus' | 'contextmenu' | 'click'

export type TippyRefElement = { _tippy?: Instance } & HTMLElement

export interface OverlayTriggerProps {
  children: TippyProps['children']
  overlay: TippyProps['content']
  overlayClassName?: string
  isDisabled?: boolean
  /**
   * Controlled mode
   * @default undefined
   */
  isVisible?: boolean | undefined
  /**
   * Uncontrolled mode
   * @default false
   */
  defaultVisible?: boolean
  /**
   * Callback executed when visibility changes
   * You can optionally `return false` to cancel the visibility change
   */
  onVisibleChange?: (isVisible: boolean) => void | false
  /**
   * Delay before showing the tooltip.
   * @default 300ms
   */
  delay?: TippyProps['delay']
  /**
   * Placement of the overlay.
   * @default 'top'
   */
  placement?: Placement
  trigger?: Trigger
  role?: 'tooltip' | 'dialog' | 'menu'
  touch?: TippyProps['touch']
  hideOnClick?: TippyProps['hideOnClick']
  /**
   * Determines the size of the invisible border around the tippy that will prevent it
   * from hiding if the cursor left it.
   * @default 2
   */
  interactiveBorder?: TippyProps['interactiveBorder']
  offset?: TippyProps['offset']
  triggerTarget?: TippyProps['triggerTarget']
  /**
   * Append the overlay to a specific element.
   * @default 'parent'
   */
  appendTo?: TippyProps['appendTo']
  onCreate?: TippyProps['onCreate']
  onTrigger?: TippyProps['onTrigger']
  onUntrigger?: TippyProps['onUntrigger']
  /**
   * append Arrow element to the overlay
   * @default true
   */
  hasArrow?: boolean
  /**
   * Remove the overlay DOM node when it's not visible
   * @default true
   */
  removeOnHide?: boolean
}

const Arrow = styled('div', {
  [`--${prefix}-overlay-arrow-width`]: '4px',
  position: 'absolute',
  height: 0,
  width: 0,
  borderStyle: 'solid',
  borderWidth: `var(--${prefix}-overlay-arrow-width)`,
  borderColor: 'inherit',
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderBottomColor: 'transparent',
  /**
   * Selector operator `^=` means "starts with", because we could also have placements like `top-start`
   */
  '&[data-overlay-placement^="top"]': {
    top: '100%',
    left: '50%',
    marginLeft: `calc(-1 * var(--${prefix}-overlay-arrow-width))`
  },
  '&[data-overlay-placement^="bottom"]': {
    bottom: '100%',
    left: '50%',
    transform: 'rotate(-180deg)',
    marginLeft: `calc(-1 * var(--${prefix}-overlay-arrow-width))`
  },
  '&[data-overlay-placement^="left"]': {
    left: '100%',
    transform: 'rotate(-90deg)',
    top: '50%',
    marginTop: `calc(-1 * var(--${prefix}-overlay-arrow-width))`
  },
  '&[data-overlay-placement^="right"]': {
    right: '100%',
    transform: 'rotate(90deg)',
    top: '50%',
    marginTop: `calc(-1 * var(--${prefix}-overlay-arrow-width))`
  }
})

const OverlayTrigger: ForwardRefRenderFunction<Element, OverlayTriggerProps> = (props, ref) => {
  const {
    children,
    overlay,
    isVisible,
    isDisabled = false,
    onVisibleChange,
    delay = 300,
    placement = 'top',
    trigger,
    role,
    hideOnClick,
    interactiveBorder = 2, // 2px
    offset,
    triggerTarget,
    appendTo = 'parent',
    onCreate,
    onTrigger,
    onUntrigger,
    overlayClassName,
    removeOnHide = true,
    hasArrow = true,
    defaultVisible = false
  } = props
  const [mounted, setMounted] = useState(false)
  const [instance, setInstance] = useState(null)
  const overlayId = `tippy-${instance?.id}`

  const plugin = {
    fn: () => ({
      onCreate: tippy => {
        setInstance(tippy)
      },
      onMount: () => setMounted(true),
      onHidden: () => setMounted(false),
      onHide: () => (typeof onVisibleChange === 'function' ? onVisibleChange(false) : undefined),
      onShow: () => (typeof onVisibleChange === 'function' ? onVisibleChange(true) : undefined)
    })
  }

  const unControlledProps =
    isVisible === undefined
      ? {
          // Use manual trigger to improve accessibility
          trigger: trigger === 'click' ? 'manual' : trigger,
          showOnCreate: defaultVisible
        }
      : {}

  const overlayDom = (attr: Parameters<TippyProps['render']>[0]): ReactNode =>
    overlayClassName || hasArrow ? (
      <div className={overlayClassName} role={role}>
        {overlay}
        {hasArrow && <Arrow aria-hidden data-overlay-arrow data-overlay-placement={attr['data-placement']} />}
      </div>
    ) : (
      overlay
    )

  return (
    <Tippy
      {...unControlledProps}
      ref={ref}
      appendTo={appendTo}
      plugins={[plugin]}
      interactive={true}
      offset={offset}
      placement={placement}
      visible={isVisible}
      disabled={isDisabled}
      delay={delay}
      role={role}
      triggerTarget={triggerTarget}
      onCreate={onCreate}
      onTrigger={onTrigger}
      onUntrigger={onUntrigger}
      popperOptions={{
        strategy: 'fixed'
      }}
      hideOnClick={hideOnClick}
      interactiveBorder={interactiveBorder}
      render={attr => (removeOnHide && !mounted ? undefined : overlayDom(attr))}>
      {cloneElement(children, {
        /**
         *  A tooltip is not considered to be a popup in this context, as is not interactive.
         * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup
         */
        'aria-haspopup': role === 'tooltip' ? false : role,
        'aria-controls': overlayId,
        ...(role === 'tooltip' ? { 'aria-describedby': overlayId } : {}),
        ...(trigger === 'click' ? { onPress: () => instance.show() } : {}),
        ...(trigger === 'contextmenu' ? { onContextMenu: (e: MouseEvent) => e.preventDefault() } : {})
      })}
    </Tippy>
  )
}

const _OverlayTrigger = forwardRef(OverlayTrigger)
export { _OverlayTrigger as OverlayTrigger }
