import { MouseEvent, ReactNode, useMemo, useState, forwardRef, ForwardRefRenderFunction } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import type { Identifier } from 'dnd-core'
import { rem } from 'polished'
import { Right } from '@brickdoc/design-icons'
import { useMemoizedFn } from '../../hooks'
import { useForwardedRef } from '../../hooks/useForwardedRef'

import { NodeMovement, NodeRelativeSpot, InternalTreeNode, TreeNodeRenderer } from './constants'
import { TreeRoot } from './style'
import { calculateRelativeSpot } from './helpers'

export interface NodeProps {
  nodeData: InternalTreeNode
  className?: string
  emptyNode?: string | ReactNode
  onToggleExpansion: (node: InternalTreeNode) => void
  onSelect?: (node: InternalTreeNode) => void
  nodeRenderer?: TreeNodeRenderer
  selected?: boolean
  index: number
  onMoveNode: (item: NodeMovement) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

const DND_NODE_TYPE = 'node'

/** Tree
 * @example
 */
export const InternalNode: ForwardRefRenderFunction<HTMLDivElement, NodeProps> = (
  {
    nodeData: treeData,
    className,
    onToggleExpansion: onToggleExpand,
    onSelect,
    nodeRenderer,
    selected,
    emptyNode,
    index,
    onMoveNode: moveNode
  },
  _ref
) => {
  const { id: nodeId, icon = '', parentId, rootId, isExpanded, hasChildren, indent } = treeData
  const ref = useForwardedRef(_ref)
  const [dropSpot, setDropSpot] = useState<NodeRelativeSpot | null>(null)

  const handleSelect = useMemoizedFn(_e => onSelect?.(treeData))

  const handleToggleExpand = useMemoizedFn((e: MouseEvent) => {
    e.stopPropagation()
    onToggleExpand(treeData)
  })

  const hasEmptyNode = useMemo(
    () => !parentId && rootId === nodeId && !hasChildren,
    [parentId, rootId, nodeId, hasChildren]
  )

  const emptyItem = typeof emptyNode === 'string' ? <TreeRoot.EmptyNode>{emptyNode}</TreeRoot.EmptyNode> : emptyNode

  const showEmptyItem = hasEmptyNode && isExpanded ? emptyItem : null

  const [{ isDragging }, drag] = useDrag({
    type: DND_NODE_TYPE,
    item: { nodeId, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [{ handlerId, isOver, isOverCurrent }, drop] = useDrop<
    DragItem,
    void,
    {
      handlerId: Identifier | null
      isOver: boolean
      isOverCurrent: boolean
    }
  >({
    accept: DND_NODE_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver()
      }
    },
    hover(item, monitor: any) {
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      setDropSpot(calculateRelativeSpot(monitor.getClientOffset(), ref.current))
    },
    drop(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      const dropSpot = calculateRelativeSpot(monitor.getClientOffset(), ref.current)

      // Time to actually perform the action
      if (dropSpot) {
        moveNode?.({
          sourceIndex: dragIndex,
          sourceId: item.id,
          targetIndex: hoverIndex,
          targetId: nodeId,
          targetSpot: dropSpot
        })
      }
    }
  })

  const renderBorder = useMemo(() => {
    let css = {}
    switch (dropSpot) {
      case NodeRelativeSpot.Before:
        css = {
          borderTop: isOver && isOverCurrent ? '2px dashed blue' : 'none'
        }
        break
      case NodeRelativeSpot.AsChild:
        css = {
          border: isOver && isOverCurrent ? '1px dashed blue' : 'none'
        }
        break
      case NodeRelativeSpot.After:
        css = {
          borderBottom: isOver && isOverCurrent ? '2px dashed blue' : 'none'
        }
        break
      default:
        css = {}
        break
    }
    return css
  }, [isOver, isOverCurrent, dropSpot])

  drag(drop(ref))

  return (
    <>
      <TreeRoot.Base
        ref={ref}
        data-handler-id={handlerId}
        dragging={isDragging}
        selected={selected}
        role="button"
        tabIndex={0}
        data-test-id="BrkTree"
        className={className}
        css={renderBorder}
      >
        <TreeRoot.Indent
          css={{
            width: rem(`${16 * indent}px`)
          }}
          data-test-id="indent"
        />
        <TreeRoot.PageItem
          data-test-id="page-item"
          css={{
            width: `calc(100% - ${rem(`${16 * indent}px`)})`
          }}
        >
          <TreeRoot.ItemContent data-test-id="item-content" onClick={handleSelect}>
            <TreeRoot.Content data-test-id="content">
              {hasChildren || hasEmptyNode ? (
                <TreeRoot.ContentArrow
                  isExpanded={isExpanded}
                  data-test-id="content-arrow"
                  onClick={handleToggleExpand}
                >
                  <Right data-test-id="content-icon" />
                </TreeRoot.ContentArrow>
              ) : (
                <TreeRoot.ContentArrow data-test-id="content-arrow" onClick={handleToggleExpand}>
                  <TreeRoot.LeafDot data-test-id="leaf-dot" />
                </TreeRoot.ContentArrow>
              )}
              {icon ? <TreeRoot.ContentIcon data-test-id="content-icon">{icon}</TreeRoot.ContentIcon> : <></>}
              {/* Todo: fixed TS2769: No overload matches this call. pressProps.css */}
              <TreeRoot.ContentAction data-test-id="content-action">{nodeRenderer?.(treeData)}</TreeRoot.ContentAction>
            </TreeRoot.Content>
          </TreeRoot.ItemContent>
        </TreeRoot.PageItem>
      </TreeRoot.Base>
      {showEmptyItem}
    </>
  )
}

export const Node = forwardRef(InternalNode)
Node.displayName = 'Node'
