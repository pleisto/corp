import { ReactNode } from 'react'

export interface TNode {
  key: string
  value: string
  parentId?: string | null | undefined
  rootId?: string
  title: ReactNode | string
  icon: string | null
  sort: number
  firstChildSort: string
  collapsed?: boolean
  children: TNode[]

  /**
   * Internal data of the node's context
   * for building up the tree. You don't
   * need to assign it when building up the
   * `TreeNodeData`.
   */
  context?: NodeContext
}

export type TNodeWithContext = Omit<TNode, 'context'> & {
  context: NodeContext
}

/**
 * Node context is a set of data that is
 * set internally by the tree component.
 * It is not required when passing node data
 * TO the tree, but is essential to build the
 * tree in a proper shape.
 */
export interface NodeContext {
  hasChildren: boolean
  indent: number
}

export enum Inserted {
  Top,
  Bottom,
  Child
}

export interface MoveNode {
  sourceIndex: number
  sourceId: string
  targetIndex: number
  targetId: string
  position: Inserted
}
