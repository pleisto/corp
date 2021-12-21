import React from 'react'
import { Icon } from '@brickdoc/design-system'
import { ActionOptionGroup, ActionItemOptionGroup } from './BlockActions'
import { Toolbar, ToolbarOptionGroup } from '../Toolbar'

export interface BlockActionsMenuProps {
  basicOptions?: ActionItemOptionGroup | null
  extraOptions?: ActionOptionGroup | null
}

export const BlockActionsMenu: React.FC<BlockActionsMenuProps> = ({ extraOptions, basicOptions }) => {
  const options = React.useMemo<ToolbarOptionGroup>(() => {
    const hasExtraOptions = (extraOptions?.length ?? 0) > 0
    const hasBasicOptions = (basicOptions?.length ?? 0) > 0
    const value = hasExtraOptions ? extraOptions : basicOptions

    if (hasExtraOptions && hasBasicOptions) {
      value?.push({
        type: 'dropdown',
        name: 'more',
        icon: <Icon.More />,
        menuItems: basicOptions!
      })
    }

    return value ?? []
  }, [basicOptions, extraOptions])

  return <Toolbar options={options} />
}
