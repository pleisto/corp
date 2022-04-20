import { BrickdocEventBus, ExplorerMenuGroup, ExplorerMenuTrigger } from '@brickdoc/schema'
import { useCallback, useEffect, useState } from 'react'
import { useDrawerService, DrawerView } from '../../../services/DrawerService'

export interface UseExplorerMenuReturn {
  groupSource: ExplorerMenuGroup[]
  visible: boolean
  toggle: (visible: boolean) => void
}

export const useExplorerMenu = (): UseExplorerMenuReturn => {
  const visible = useDrawerService(service => service.view) === DrawerView.ExplorerMenu
  const close = useDrawerService(service => service.close)
  const open = useDrawerService(service => service.open)
  const [groupSource, setGroupSource] = useState<ExplorerMenuGroup[]>([])

  const toggle = useCallback(
    (visible: boolean) => {
      visible ? open(DrawerView.ExplorerMenu) : close()
    },
    [open, close]
  )

  useEffect(
    () =>
      BrickdocEventBus.subscribe(ExplorerMenuTrigger, event => {
        setGroupSource(event.payload.items ?? [])
      }).unsubscribe,
    []
  )
  return {
    groupSource,
    visible,
    toggle
  }
}
