import { ReactNode } from 'react'

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
