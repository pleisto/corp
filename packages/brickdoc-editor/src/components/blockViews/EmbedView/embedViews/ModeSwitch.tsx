import { FC } from 'react'
import { EmbedViewMode } from '../../../../extensions/blocks/embed/meta'
import { Toolbar } from '../../../ui'
import { EmbedBlockType, UpdateEmbedBlockAttributes } from '../EmbedView'
import { useModeSwitchOptions } from './useModeSwitchOptions'

export interface ModeSwitchProps {
  mode: EmbedViewMode
  blockType: EmbedBlockType
  displayName: string
  url: string
  updateEmbedBlockAttributes: UpdateEmbedBlockAttributes
  onFullScreen?: VoidFunction
}

export const ModeSwitch: FC<ModeSwitchProps> = ({
  mode,
  blockType,
  displayName,
  url,
  updateEmbedBlockAttributes,
  onFullScreen
}) => {
  const [options] = useModeSwitchOptions({
    mode,
    blockType,
    displayName,
    url,
    updateEmbedBlockAttributes,
    onFullScreen
  })

  return <Toolbar type="transparent" options={options} />
}

ModeSwitch.toString = () => '.embed-view-mode-switch'
