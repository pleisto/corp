import { ReactNode } from 'react'

export interface TNode {
  key: string
  value: string
  title: ReactNode | string
  parentId?: string | null | undefined
  rootId?: string
  icon?: string | null
  isOpen?: boolean
  children?: TNode[]
}

export type TNodeWithContext = TNode & {
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
