import { XYCoord } from 'react-dnd'
import { Inserted, type TNode } from './constants'

/**
 * join `newId` by its full path in `tree` to `existingIds`.
 * @returns
 */
export function joinNodeIdsByPath(tree: TNode[], newId: string, existingIds?: string[]): string[] | undefined {
  if (existingIds?.includes(newId)) return existingIds
  const ids = existingIds ?? []
  for (const node of tree) {
    if (node.value === newId) {
      return [...ids, node.value]
    }
    if (node.children && node.children.length > 0) {
      const nextIds = ids.includes(node.value) ? ids : [...ids, node.value]
      const result = joinNodeIdsByPath(node.children, newId, nextIds)
      if (result) return result
    }
  }
}

/**
 * Calculate where to place a new node to the `targetNode`
 * based on the position of the insertion point.
 * @param pos The X-Y coordinate of the insertion point.
 * @param targetNode The target node used as the reference point.
 * @returns The insertion place of the new node, or `null` if it's an invalid operation.
 */
export function calculateInsertionPlace(pos: XYCoord | null, targetNode: HTMLElement | null): Inserted | null {
  // Determine node's rectangle in the window
  const nodeRect = targetNode?.getBoundingClientRect()
  if (!nodeRect) return null
  if (pos === null) return null

  // Get the y-pos of the rect's center
  const nodeCenterY = (nodeRect.bottom - nodeRect.top) / 2
  // Get the y-pos of the insertion point in the rect's LOCAL coordinates
  const localY = pos.y - nodeRect.top

  const topThreshold = nodeCenterY - 10
  const bottomThreshold = nodeCenterY + 10
  if (localY <= topThreshold) {
    return Inserted.Top
  }
  if (localY >= bottomThreshold) {
    return Inserted.Bottom
  }
  return Inserted.Child
}
