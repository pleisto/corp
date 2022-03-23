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
  ForwardedRef
} from 'react'
import { preserveRef } from '../../../utilities/preserveRef'
import tippy from 'tippy.js'

type AllowedTippyChildren = ReactChild | ReactFragment | undefined | null
export interface TippyProps {
  children?: AllowedTippyChildren
}

function isChildrenEmpty(children: AllowedTippyChildren): boolean {
  return children === undefined || children === null || (isArray(children) && children.length === 0)
}
function isChildrenForwarded(children: AllowedTippyChildren): children is { ref: ForwardedRef<{}> } {
  return isValidElement(children) && 'ref' in children
}

export const Tippy: FC<TippyProps> = ({ children }) => {
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

  useEffect(() => {
    if (!anchorRef.current) return
    tippy(anchorRef.current, { content: 'hello!' })
  }, [])

  console.log('children\n', children)
  console.log('anchor\n', anchor)

  return anchor
}
