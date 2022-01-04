import { MouseEvent, ReactNode } from 'react'
import { PressEvent } from '@react-types/shared/src/events'

export interface TagProps {
  closable?: boolean
  size?: 'sm' | 'lg' | 'md'
  color?: 'none' | 'primary' | 'red'
  border?: boolean
  prefixCls?: string
  onClick?: (e: MouseEvent<HTMLElement> | PressEvent) => void
  onClose?: (e: MouseEvent<HTMLElement>, value: ReactNode) => void
  children?: ReactNode
}

export interface TagGroupProps {
  size?: 'sm' | 'lg' | 'md'
  tagList: Array<TagProps | React.ReactNode>
}
