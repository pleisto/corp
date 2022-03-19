import { XYCoord } from 'react-dnd'
import { NodeRelativeSpot, type TreeNode } from './constants'

/**
 * join `newId` by its full path in `tree` to `existingIds`.
 * @returns
 */
export function joinNodeIdsByPath(tree: TreeNode[], newId: string, existingIds?: string[]): string[] | undefined {
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
 * Calculate which relative spot a point fits in based on the
 * `targetNode`'s local coordinate system.
 * @param pos The X-Y coordinate of the point to check.
 * @param targetNode The target node used as the reference area.
 * @returns The calculated relative spot, or `null` if the operation is invalid.
 */
export function calculateRelativeSpot(pos: XYCoord | null, targetNode: HTMLElement | null): NodeRelativeSpot | null {
  // Determine node's rectangle in the browser window
  const targetRect = targetNode?.getBoundingClientRect()
  if (!targetRect) return null
  if (pos === null) return null

  // Get the rect center's y-pos
  const midY = (targetRect.bottom - targetRect.top) / 2
  // Get the point's LOCAL y-pos (in rect's local system)
  const localY = pos.y - targetRect.top

  const topThreshold = midY - 10
  const bottomThreshold = midY + 10
  if (localY <= topThreshold) {
    return NodeRelativeSpot.Before
  }
  if (localY >= bottomThreshold) {
    return NodeRelativeSpot.After
  }
  return NodeRelativeSpot.AsChild
}
