import {
  ForwardRefRenderFunction,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  ReactNode,
  forwardRef,
  RefCallback
} from 'react'
import deepEqual from 'fast-deep-equal'
import List, { ListRef } from 'rc-virtual-list'
import { DndProvider } from 'react-dnd'
import { HTML5Backend, HTML5BackendOptions } from 'react-dnd-html5-backend'
import type { TNode, MoveNode, TNodeWithContext } from './constants'
import { Node } from './node'
import { useMemoizedFn } from '../../hooks'
import { useDeepMemo } from '../../hooks/useDeepMemo'
import { joinNodeIdsByPath } from './helpers'

export interface TreeProps {
  height?: number
  treeData: TNode[]
  selectedNodeId?: string
  className?: string
  treeNodeClassName?: string
  openAll?: boolean
  draggable?: boolean
  onDrop?: (attrs: MoveNode) => void
  titleRender?: (node: TNode) => ReactNode
  emptyNode?: string | ReactNode
}

const NODE_HEIGHT = 34
const DEFAULT_HEIGHT = 200

/** Tree
 * @example
 */
const TreeInternal: ForwardRefRenderFunction<any, TreeProps> = (
  {
    height,
    treeData: nextTreeData,
    openAll = false,
    titleRender,
    emptyNode,
    selectedNodeId,
    draggable = false,
    className,
    treeNodeClassName,
    onDrop
  },
  ref
) => {
  // To cache tree data in case its reference changes outside the component
  // in order to optimize everything in the rendering flow corresponding
  // to the tree data.
  const treeData = useDeepMemo(nextTreeData)

  const listRef = useRef<ListRef>()
  const [openIds, setOpenIds] = useState<string[]>(
    openAll ? treeData.map(node => node.value) : treeData.filter(node => node.isOpen).map(node => node.value) || []
  )

  // `selectedId` is updated when:
  // 1. The external prop `selectedNodeId` is updated; OR
  // 2. the component updates the `selectedId` state.
  const [selectedId, setSelectedId] = useState<string | undefined>(selectedNodeId)
  useDeepMemo(selectedNodeId, next => {
    setSelectedId(next)
  })

  useEffect(() => {
    if (selectedId) {
      const nextOpenIds = joinNodeIdsByPath(treeData, selectedId, openIds) ?? []
      if (!deepEqual(nextOpenIds, openIds)) {
        setOpenIds(nextOpenIds)
        console.log('set open ids', [nextOpenIds, openIds])
      }
    }
  }, [treeData, selectedId, openIds])

  const flatten = useCallback(
    (node, indent: number, result: TNodeWithContext[]) => {
      const { children, value } = node
      const isOpen = openIds.includes(value)

      result.push({
        ...node,
        isOpen,
        context: {
          hasChildren: (children ?? []).length > 0,
          indent: indent ?? 0
        }
      })

      if (isOpen && children) {
        for (const child of children) {
          flatten(child, indent + 1, result)
        }
      }
    },
    [openIds]
  )

  const nodeList = useMemo(() => {
    const result: TNodeWithContext[] = []
    for (const node of treeData) {
      flatten(node, 0, result)
    }
    return result
  }, [treeData, flatten])

  const handleSelected = useMemoizedFn((id: string) => setSelectedId(id))

  const handleItemClick = useMemoizedFn((node: TNode) => {
    node.isOpen ? setOpenIds(i => i.filter(value => value !== node.value)) : setOpenIds(i => [...i, node.value])
  })

  const moveNode = useMemoizedFn((item: MoveNode) => {
    if (!draggable) return
    onDrop?.(item)
  })

  // add a root element to limit dnd scope
  const [html5Options, setHtml5Options] = useState<HTML5BackendOptions>()
  const handleDndAreaRef = useCallback<RefCallback<HTMLDivElement>>(node => {
    if (node) {
      setHtml5Options({ rootElement: node })
    }
  }, [])

  const finalHeight = height ?? Math.min(nodeList.length * NODE_HEIGHT, DEFAULT_HEIGHT)

  return (
    <div ref={handleDndAreaRef}>
      {/* make sure root area is mounted, then mount dnd area */}
      {html5Options?.rootElement && (
        <DndProvider backend={HTML5Backend} options={html5Options}>
          <List<TNodeWithContext>
            className={className}
            data={nodeList}
            data-test-id="virtual-list"
            height={finalHeight}
            itemHeight={NODE_HEIGHT}
            itemKey="key"
            ref={ref ?? listRef}
          >
            {(item, index) => (
              <Node
                className={treeNodeClassName}
                moveNode={moveNode}
                id={item.key}
                index={index}
                key={item.key}
                emptyNode={emptyNode}
                treeData={item}
                onClick={handleItemClick}
                handleSelected={handleSelected}
                titleRender={titleRender}
                selectedId={selectedId}
              />
            )}
          </List>
        </DndProvider>
      )}
    </div>
  )
}

const _TreeInternal = forwardRef(TreeInternal)
_TreeInternal.displayName = 'Tree'

export { _TreeInternal as Tree }
