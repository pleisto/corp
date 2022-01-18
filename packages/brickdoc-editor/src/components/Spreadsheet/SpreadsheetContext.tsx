import React from 'react'

export interface SpreadsheetSelectionCellId {
  columnId: string
  rowId: string
}

export interface SpreadsheetSelection {
  all?: boolean
  columnIds?: string[]
  rowIds?: string[]
  cellIds?: string[]
}

export interface SpreadsheetContext {
  selection: SpreadsheetSelection
  setSelection: (selection: SpreadsheetSelection) => void
  clearSelection: () => void
  selectRows: (rowIds: string[]) => void
  selectColumns: (columnIds: string[]) => void
  selectCell: (cellId: string) => void
}

export const useSpreadsheetContext = (): SpreadsheetContext => {
  const [selection, setSelection] = React.useState<SpreadsheetSelection>({})

  const clearSelection = (): void => {
    setSelection({})
  }

  const selectRows = (rowIds: string[]): void => {
    setSelection({ rowIds })
  }

  const selectColumns = (columnIds: string[]): void => {
    setSelection({ columnIds })
  }

  const selectCell = (cellId: string): void => {
    setSelection({ cellIds: [...(selection.cellIds ?? []), cellId] })
  }

  return {
    selection,
    setSelection,
    clearSelection,
    selectRows,
    selectColumns,
    selectCell
  }
}
