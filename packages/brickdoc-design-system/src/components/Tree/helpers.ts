import { type TNode } from './constants'

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
