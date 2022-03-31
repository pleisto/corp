import { isArray } from '@brickdoc/active-support'
import {
  cloneElement,
  FC,
  ReactChild,
  ReactFragment,
  useRef,
  isValidElement,
  useMemo,
  useEffect,
  ForwardedRef,
  ReactNode
} from 'react'
import { preserveRef } from '../../../utilities/preserveRef'
import tippy, { Props as TippyInitProps } from 'tippy.js'
import { tooltipStyle } from '../styles/tooltip.style'
import { CSSProperties } from '@stitches/react'

export type AllowedTippyProps = Pick<
  TippyInitProps,
  | 'animation'
  | 'aria'
  | 'arrow'
  | 'delay'
  | 'duration'
  | 'followCursor'
  | 'hideOnClick'
  | 'inertia'
  | 'interactive'
  | 'interactiveBorder'
  | 'interactiveDebounce'
  | 'maxWidth'
  | 'moveTransition'
  | 'offset'
  | 'placement'
  | 'popperOptions'
  | 'role'
  | 'showOnCreate'
  | 'theme'
  | 'touch'
  | 'trigger'
  | 'zIndex'
>
export type AllowedTippyChildren = ReactChild | ReactFragment | undefined | null

export interface TippyProps extends Partial<AllowedTippyProps> {
  /** Content to be shown in the popper */
  content: ReactNode
  /** The anchor (trigger) element of the popper */
  children?: AllowedTippyChildren
  /** The CSS class of the **CONTENT** */
  className?: string
  /** The CSS inline style of the **CONTENT** */
  style?: CSSProperties
}

export const Tippy: FC<TippyProps> = ({ children, content, className, style, ...restProps }: TippyProps) => {
  tooltipStyle()
  const anchorRef = useRef<HTMLElement>()
  const anchor = useMemo(() => {
    if (isChildrenEmpty(children)) return <></>
    const safeChildren = isValidElement(children) ? children : <div>{children}</div>
    return cloneElement(safeChildren, {
      ref(value: any) {
        anchorRef.current = value
        if (isChildrenForwarded(safeChildren)) {
          preserveRef(safeChildren.ref, value)
        }
      }
    })
  }, [children])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!anchorRef.current) return
    if (!containerRef.current) return

    const instance = tippy(anchorRef.current, {
      content: containerRef.current,
      ...restProps
    })
    return () => {
      instance.destroy()
    }
  }, [restProps])

  return (
    <>
      {anchor}
      <div className={className} style={style} ref={containerRef}>
        {content}
      </div>
    </>
  )
}

function isChildrenEmpty(children: AllowedTippyChildren): boolean {
  return children === undefined || children === null || (isArray(children) && children.length === 0)
}
function isChildrenForwarded(children: AllowedTippyChildren): children is { ref: ForwardedRef<{}> } {
  return isValidElement(children) && 'ref' in children
}
