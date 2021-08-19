import React from 'react'
import { TableActiveStatus } from 'react-table'

export function useActiveStatus(): [
  {
    isRowActive: (rowIndex: number) => boolean
    isCellActive: (rowIndex: number, cellIndex: number) => boolean
    update: React.Dispatch<React.SetStateAction<TableActiveStatus[]>>
    reset: () => void
  }
] {
  const [activeItems, setActiveStatus] = React.useState<TableActiveStatus[]>([])
  const isRowActive = React.useCallback(
    (rowIndex: number): boolean => activeItems.some(item => item.rowIndex === rowIndex && item.columnIndex === undefined),
    [activeItems]
  )
  const isCellActive = React.useCallback(
    (rowIndex: number, columnIndex: number): boolean =>
      activeItems.some(item => {
        return item.rowIndex === rowIndex && item.columnIndex === columnIndex
      }),
    [activeItems]
  )

  return React.useMemo(
    () => [{ isRowActive, isCellActive, update: setActiveStatus, reset: () => setActiveStatus([]) }],
    [isCellActive, isRowActive]
  )
}
