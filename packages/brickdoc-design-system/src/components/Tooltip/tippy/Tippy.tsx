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
import { tippyStyle } from '../styles/tippy.style'
import { createPortal } from 'react-dom'

type AllowedTippyChildren = ReactChild | ReactFragment | undefined | null
export interface TippyProps extends Partial<Omit<TippyInitProps, 'content'>> {
  children?: AllowedTippyChildren
  content: ReactNode
}

function isChildrenEmpty(children: AllowedTippyChildren): boolean {
  return children === undefined || children === null || (isArray(children) && children.length === 0)
}
function isChildrenForwarded(children: AllowedTippyChildren): children is { ref: ForwardedRef<{}> } {
  return isValidElement(children) && 'ref' in children
}

export const Tippy: FC<TippyProps> = ({ children, content, ...restProps }) => {
  tippyStyle()
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

  const popperContainer = useMemo(() => {
    return document.createElement('div')
  }, [])

  useEffect(() => {
    return () => {
      document.removeChild(popperContainer)
    }
  }, [popperContainer])

  useEffect(() => {
    if (!anchorRef.current) return

    const instance = tippy(anchorRef.current, {
      content: popperContainer,
      trigger: 'click',
      arrow: true
    })
    return () => {
      instance.destroy()
    }
  }, [popperContainer])

  return (
    <>
      {anchor}
      {createPortal(content, popperContainer)}
    </>
  )
}
