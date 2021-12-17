import { FC, useCallback, memo, MouseEvent, ReactNode, useMemo, useRef } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { usePress } from '@react-aria/interactions'
import { rem } from 'polished'
import { Right } from '@brickdoc/design-icons'
import type { MoveNode, TNode } from './constants'
import { TreeRoot } from './style'

export interface NodeProps {
  treeData: TNode
  emptyNode?: string | ReactNode
  onClick: (node: TNode) => void
  handleSelected: (id: string) => void
  titleRender?: (node: TNode) => ReactNode
  selectedId?: string
  id: any
  index: number
  moveNode: (item: MoveNode) => void
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
const InternalNode: FC<NodeProps> = ({
  treeData,
  onClick,
  handleSelected,
  titleRender,
  selectedId,
  emptyNode,
  id,
  index,
  moveNode
}) => {
  const { icon = '', hasChildren, parentId, rootId, indent = 0, value, collapsed } = treeData
  const ref = useRef<HTMLDivElement>(null)

  const { pressProps, isPressed } = usePress({
    onPress: e => {
      if (e.type === 'press') {
        handleSelected(value)
      }
    }
  })

  const handleOpen = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      onClick(treeData)
    },
    [treeData, onClick]
  )

  const hasEmptyNode = useMemo(
    () => !parentId && rootId === value && !hasChildren,
    [parentId, rootId, value, hasChildren]
  )

  const emptyItem = typeof emptyNode === 'string' ? <TreeRoot.EmptyNode>{emptyNode}</TreeRoot.EmptyNode> : emptyNode

  const showEmptyItem = hasEmptyNode && collapsed ? emptyItem : null

  const [{ isDragging }, drag] = useDrag({
    type: DND_NODE_TYPE,
    item: { id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [{ handlerId, isOver, isOverCurrent }, drop] = useDrop({
    accept: DND_NODE_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver()
      }
    },
    drop(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveNode?.({
        sourceIndex: dragIndex,
        sourceId: item.id,
        targetIndex: hoverIndex,
        targetId: value
      })
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.

      // item.index = hoverIndex
    }
  })

  drag(drop(ref))

  return (
    <>
      <TreeRoot.Base
        ref={ref}
        data-handler-id={handlerId}
        pressed={isPressed}
        dragging={isDragging}
        selected={Boolean(value === selectedId)}
        role="button"
        tabIndex={0}
        data-test-id="BrkTree"
        css={{
          // TODO: no design drawings
          border: isOver && isOverCurrent ? '1px dashed blue' : 'none'
        }}
      >
        <TreeRoot.Indent
          css={{
            width: rem(`${16 * indent}px`)
          }}
          data-test-id="indent"
        />
        <TreeRoot.PageItem data-test-id="page-item">
          <TreeRoot.ItemContent data-test-id="item-content">
            <TreeRoot.Content data-test-id="content">
              {hasChildren || hasEmptyNode ? (
                <TreeRoot.ContentArrow isOpen={collapsed} data-test-id="content-arrow" onClick={handleOpen}>
                  <Right data-test-id="content-icon" />
                </TreeRoot.ContentArrow>
              ) : (
                <TreeRoot.ContentArrow data-test-id="content-arrow" onClick={handleOpen}>
                  <TreeRoot.LeafDot data-test-id="leaf-dot" />
                </TreeRoot.ContentArrow>
              )}
              {icon ? <TreeRoot.ContentIcon data-test-id="content-icon">{icon}</TreeRoot.ContentIcon> : <></>}
              {/* Todo: fixed TS2769: No overload matches this call. pressProps.css */}
              <TreeRoot.ContentAction data-test-id="content-action" {...(pressProps as any)}>
                {titleRender?.(treeData)}
              </TreeRoot.ContentAction>
            </TreeRoot.Content>
          </TreeRoot.ItemContent>
        </TreeRoot.PageItem>
      </TreeRoot.Base>
      {showEmptyItem}
    </>
  )
}

InternalNode.displayName = 'BrkNode'

export const Node = memo(InternalNode)
