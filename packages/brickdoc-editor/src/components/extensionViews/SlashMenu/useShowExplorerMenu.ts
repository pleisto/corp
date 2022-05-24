import { useCallback } from 'react'
import { BrickdocEventBus, SlashMenuHide, ExplorerMenuTrigger } from '@brickdoc/schema'

export function useShowExplorerMenu(): [VoidFunction] {
  const handleShowExplorerMenu = useCallback(() => {
    void BrickdocEventBus.dispatch(SlashMenuHide({}))
    void BrickdocEventBus.dispatch(ExplorerMenuTrigger({ visible: true }))
  }, [])

  return [handleShowExplorerMenu]
}
