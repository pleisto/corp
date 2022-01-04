import { forwardRef, ForwardRefRenderFunction } from 'react'
import { Tag } from './'

import type { TagGroupProps } from './constants'
import { prefix } from '../../themes'

const TagGroup: ForwardRefRenderFunction<unknown, TagGroupProps> = (props, ref) => {
  const { children, tagList = [], size = 'md', ...otherProps } = props

  return (
    <div>
      {tagList.map((i, key) => (
        <Tag size={size} {...i} key={key} {...otherProps} />
      ))}
    </div>
  )
}

const _TagGroup = forwardRef(TagGroup)

_TagGroup.displayName = `${prefix}TagGroup`

export { _TagGroup as TagGroup }
