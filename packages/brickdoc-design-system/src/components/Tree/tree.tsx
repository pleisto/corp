import {
  ForwardRefRenderFunction,
  useState,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
  forwardRef,
  RefCallback
} from 'react'
import deepEqual from 'fast-deep-equal'
import List, { ListRef } from 'rc-virtual-list'
import { DndProvider } from 'react-dnd'
import { HTML5Backend, HTML5BackendOptions } from 'react-dnd-html5-backend'
import type { TNode, MoveNode, TNodeWithContext, TreeNodeRenderer } from './constants'
import { Node } from './node'
import { useMemoizedFn } from '../../hooks'
import { useDeepMemo } from '../../hooks/useDeepMemo'
import { joinNodeIdsByPath } from './helpers'

export interface TreeProps {
  height?: number
  treeData: TNode[]
  initialSelectedId?: string
  className?: string
  treeNodeClassName?: string
  expandAll?: boolean
  expandOnSelect?: boolean
  draggable?: boolean
  onDrop?: (attrs: MoveNode) => void
  titleRender?: TreeNodeRenderer
  emptyNode?: string | ReactNode
}

/**
 * A ref object that can perform actions on the tree.
 */
export type TreeRef = ListRef

const NODE_HEIGHT = 34
const DEFAULT_HEIGHT = 200

/** Tree
 * @example
 */
const TreeInternal: ForwardRefRenderFunction<TreeRef, TreeProps> = (
  {
    height,
    treeData: nextTreeData,
    expandAll,
    expandOnSelect,
    titleRender,
    emptyNode,
    initialSelectedId,
    draggable,
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

  const listRef = useRef<ListRef>(null)
  const [expandedIds, setExpandedIds] = useState<string[]>(() => {
    if (expandAll) {
      return treeData.map(node => node.value)
    }
    const ids = treeData.filter(node => node.isExpanded).map(node => node.value) || []
    if (initialSelectedId) {
      // The selected node is initially expanded on the component mount.
      ids.push(initialSelectedId)
    }
    return ids
  })

  const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId)

  const nodeList = useMemo(() => {
    function flatten(node: TNode, indent: number, result: TNodeWithContext[]): void {
      const { children, value } = node
      const isExpanded = expandedIds.includes(value)

      result.push({
        ...node,
        isExpanded,
        context: {
          hasChildren: (children ?? []).length > 0,
          indent: indent ?? 0
        }
      })

      if (isExpanded && children) {
        for (const child of children) {
          flatten(child, indent + 1, result)
        }
      }
    }

    const result: TNodeWithContext[] = []
    for (const node of treeData) {
      flatten(node, 0, result)
    }
    return result
  }, [treeData, expandedIds])

  const handleSelectNode = useMemoizedFn((node: TNodeWithContext) => {
    setSelectedId(node.value)
    if (expandOnSelect && !node.isExpanded && node.value) {
      const nextExpandedIds = joinNodeIdsByPath(treeData, node.value, expandedIds) ?? []
      if (!deepEqual(nextExpandedIds, expandedIds)) {
        setExpandedIds(nextExpandedIds)
      }
    }
  })

  const handleToggleExpansion = useMemoizedFn((node: TNode) => {
    node.isExpanded
      ? setExpandedIds(i => i.filter(value => value !== node.value))
      : setExpandedIds(i => [...i, node.value])
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
  const nodeRenderer = useMemo<TreeNodeRenderer>(() => titleRender ?? defaultNodeRenderer, [titleRender])

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
                onToggleExpansion={handleToggleExpansion}
                onSelect={handleSelectNode}
                nodeRenderer={nodeRenderer}
                selected={item.value === selectedId}
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

function defaultNodeRenderer(node: TNode): ReactNode {
  return <div>{node.title}</div>
}
