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
import { popperBaseStyle } from './base.style'
import { CSSProperties } from '@stitches/react'
import { POPPER_ROOT_ATTRIBUTE } from './constants'

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
  /**
   * The CSS class of the popper's wrapping box, which includes
   * the content and the arrow.
   *
   * The DOM structure looks like:
   * ```html
   * <root>
   *   <div class="tippy-box overlayClassname">
   *     <div class="tippy-content">
   *        <div> content </div>
   *     </div>
   *     <div class="tippy-arrow">
   *     </div>
   *   </div>
   * </root>
   * ```
   * */
  boxClassname?: string
  /** The CSS class of the **CONTENT** */
  className?: string
  /** The CSS inline style of the **CONTENT** */
  style?: CSSProperties
}

export const Tippy: FC<TippyProps> = ({
  children,
  content,
  boxClassname,
  className,
  style,
  ...restProps
}: TippyProps) => {
  popperBaseStyle()
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
      content: reference => {
        return containerRef.current!
      },
      ...restProps
    })
    // Hack the tippy's element classes and attributes
    // so that we can override Tippy's default styles.
    // This is necessary to prevent collision from other
    // usage of Tippy.
    const popperRoot = instance.popper
    popperRoot.removeAttribute('data-tippy-root')
    popperRoot.setAttribute(POPPER_ROOT_ATTRIBUTE, '')
    if (boxClassname) {
      popperRoot.firstElementChild?.classList.add(boxClassname)
    }
    console.log(instance)
    return () => {
      instance.destroy()
    }
  }, [restProps, boxClassname])

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
