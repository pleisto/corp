import * as React from 'react'
import { useRef, useImperativeHandle, forwardRef } from 'react'
import Trigger, { type TriggerProps } from 'rc-trigger'
import type { AlignType, ActionType } from 'rc-trigger/lib/interface'
import { devLog } from '../../../utilities'
import { placements } from './placements'
import Content from './content'

export interface TooltipProps extends Pick<TriggerProps, 'onPopupAlign' | 'builtinPlacements'> {
  trigger?: ActionType | ActionType[]
  defaultVisible?: boolean
  visible?: boolean
  placement?: string
  /** Config popup motion */
  motion?: TriggerProps['popupMotion']
  onVisibleChange?: (visible: boolean) => void
  afterVisibleChange?: (visible: boolean) => void
  overlay: (() => React.ReactNode) | React.ReactNode
  overlayStyle?: React.CSSProperties
  overlayClassName?: string
  prefixCls?: string
  mouseEnterDelay?: number
  mouseLeaveDelay?: number
  getTooltipContainer?: (node: HTMLElement) => HTMLElement
  align?: AlignType
  showArrow?: boolean
  arrowContent?: React.ReactNode
  id?: string
  children?: React.ReactElement
  popupVisible?: boolean
  overlayInnerStyle?: React.CSSProperties
  zIndex?: number
}

const RcTooltip: React.ForwardRefRenderFunction<unknown, TooltipProps> = (props, ref) => {
  const {
    overlayClassName,
    trigger = ['hover'],
    mouseEnterDelay = 0,
    mouseLeaveDelay = 0.1,
    overlayStyle,
    prefixCls = 'rc-tooltip',
    children,
    onVisibleChange,
    afterVisibleChange,
    motion,
    placement = 'right',
    align = {},
    defaultVisible,
    getTooltipContainer,
    overlayInnerStyle,
    ...restProps
  } = props

  const domRef = useRef(null)
  useImperativeHandle(ref, () => domRef.current)

  const extraProps = { ...restProps }
  if ('visible' in props) {
    extraProps.popupVisible = props.visible
  }

  const getPopupElement = () => {
    const { showArrow = true, arrowContent = null, overlay, id } = props
    devLog('debug: overlay', overlay)
    return [
      showArrow && (
        <div className={`${prefixCls}-arrow`} key="arrow">
          {arrowContent}
        </div>
      ),
      <Content
        key="content"
        visible={props?.visible ?? false}
        prefixCls={prefixCls}
        id={id ?? ''}
        overlay={overlay}
        overlayInnerStyle={overlayInnerStyle}
      />
    ]
  }

  return (
    <Trigger
      popupClassName={overlayClassName}
      prefixCls={prefixCls}
      popup={getPopupElement}
      action={trigger}
      builtinPlacements={placements}
      popupPlacement={placement}
      ref={domRef}
      popupAlign={align}
      getPopupContainer={getTooltipContainer}
      onPopupVisibleChange={onVisibleChange}
      afterPopupVisibleChange={afterVisibleChange}
      popupMotion={motion}
      defaultPopupVisible={defaultVisible}
      destroyPopupOnHide // essentially `removeOnHide` to the inner popup component
      autoDestroy // destroy the portal DOM as well after the tooltip is dismissed
      mouseLeaveDelay={mouseLeaveDelay}
      popupStyle={overlayStyle}
      mouseEnterDelay={mouseEnterDelay}
      {...extraProps}
    >
      {children ?? <></>}
    </Trigger>
  )
}

// eslint-disable-next-line import/no-default-export
export default forwardRef(RcTooltip)
