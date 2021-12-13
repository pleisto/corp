import { FC, useCallback, useState, useMemo, ReactNode, memo } from 'react'
import Node from './node'

export interface TNode {
  key: string
  value: string
  parentId?: string
  title: ReactNode | string
  icon: string | null
  hasItemIcon?: boolean
  hasChildren: boolean
  firstChildSort: string
  indent: number
  isOpen: boolean
  collapsed: boolean
  sort: number
  lastPlaceholder: ReactNode | string
  children: TNode[]
}

export interface TreeProps {
  treeData: TNode[]
  selectedNodeId?: string
  className?: string
  openAll?: boolean
  draggable?: boolean
  // TODO
  onDrop?: any
  titleRender?: (node: TNode) => ReactNode
  emptyNode?: string | ReactNode
}

/** Tree
 * @example
 */
const TreeInternal: FC<TreeProps> = ({ treeData, openAll = false, titleRender, emptyNode, selectedNodeId }) => {
  const [closeIds, setCloseIds] = useState<string[]>(openAll ? treeData.map(node => node.value) : [])
  const [selectedId, setSelectedId] = useState<string | undefined>(selectedNodeId)

  const flattened = useCallback(
    (node, indent: number, result: TNode[]) => {
      const { children, value } = node
      const collapsed = closeIds.includes(value)

      result.push({
        ...node,
        hasChildren: (children ?? []).length > 0,
        indent: indent ?? 0,
        collapsed
      })
      if (collapsed && children) {
        for (const child of children) {
          flattened(child, indent + 1, result)
        }
      }
    },
    [closeIds]
  )

  const renderTree = useMemo(() => {
    const result: TNode[] = []
    for (const node of treeData) {
      flattened(node, 0, result)
    }
    return result
  }, [treeData, flattened])
  const handleSelected = useCallback((id: string) => setSelectedId(id), [setSelectedId])

  const handleItemClick = useCallback(
    (node: TNode) =>
      node.collapsed ? setCloseIds(i => i.filter(value => value !== node.value)) : setCloseIds(i => [...i, node.value]),
    []
  )

  return (
    <>
      {renderTree.map(item => (
        <Node
          key={item.key}
          emptyNode={emptyNode}
          treeData={item}
          onClick={handleItemClick}
          handleSelected={handleSelected}
          titleRender={titleRender}
          selectedId={selectedId}
        />
      ))}
    </>
  )
}

TreeInternal.displayName = 'BrkTree'

export const Tree = memo(TreeInternal)
