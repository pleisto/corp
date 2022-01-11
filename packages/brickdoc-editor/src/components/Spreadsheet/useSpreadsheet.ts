import React from 'react'
import { v4 as uuid } from 'uuid'
import { isEqual } from 'lodash-es'
import {
  BrickdocEventBus,
  Event,
  UpdateBlock,
  CommitBlocks,
  loadSpreadsheetBlocks,
  SpreadsheetBlocksLoaded,
  BlockInput
} from '@brickdoc/schema'

export interface SpreadsheetColumn {
  uuid: string
  title?: string
  idx: number // sparse index
  sort: number
}

export interface SpreadsheetColumns extends Array<SpreadsheetColumn> {}

export interface SpreadsheetRow {
  uuid: string
  cells: Map<number, string>
}
export interface SpreadsheetRows extends Array<SpreadsheetRow> {}

export const useSpreadsheet = (options: {
  parentId: string
  data: Record<string, any>
  updateAttributeData: (data: Record<string, any>) => void
}): {
  columns: SpreadsheetColumns
  addColumn: (index?: number) => void
  updateColumn: (column: SpreadsheetColumn) => void
  removeColumn: (column: SpreadsheetColumn) => void
  rowsCount: number
  rows: SpreadsheetRows
  addRow: (index?: number) => void
  removeRow: (index: number) => void
  title: string
  changeTitle: (title: string) => void
  getCell: (rowIdx: number, columnIdx: number) => string | undefined
  setCell: (rowIdx: number, columnIdx: number, cell: string) => void
} => {
  const { parentId, data, updateAttributeData } = options
  const columns = data.columns ?? []
  const latestColumns = React.useRef<SpreadsheetColumns>(columns)
  const latestRowsCount = React.useRef<number>(data.rowsCount || 0)
  const latestTitle = React.useRef<string>(data.title ?? '')

  const rowBlocksMap = React.useRef<Map<string, BlockInput>>(new Map<string, BlockInput>())
  // const cellBlocksMap = React.useRef<Map<string, BlockInput>>(new Map<string, BlockInput>())

  const updateSpreadsheetAttributes = React.useCallback((): void => {
    updateAttributeData({
      ...data,
      title: latestTitle.current,
      columns: latestColumns.current,
      rowsCount: latestRowsCount.current
    })
  }, [updateAttributeData, data])

  // const initialized = React.useRef(false)
  const loaded = React.useRef(false)
  const latestRows = React.useRef<SpreadsheetRows>(new Array(latestRowsCount.current))

  BrickdocEventBus.subscribe(
    SpreadsheetBlocksLoaded,
    (e: Event) => {
      const { parentId, blocks } = e.payload
      console.log(`loaded spreadsheet ${parentId}`)
      console.log(blocks)
      const newRows = [...latestRows.current]
      blocks.forEach((block: BlockInput) => {
        if (block.type === 'spreadsheetRow') {
          rowBlocksMap.current.set(block.id, block)
          newRows[block.sort] = {
            uuid: block.id,
            cells: new Map<number, string>()
          }
        }
      })
      latestRows.current = newRows
    },
    { eventId: parentId, subscribeId: parentId }
  )

  const saveBlocks = React.useCallback((): void => {
    latestRows.current.forEach((row, i) => {
      if (row && row.cells.size > 0) {
        const newRow: BlockInput = {
          id: row.uuid,
          sort: i,
          type: 'spreadsheetRow',
          parentId,
          content: [],
          meta: {},
          text: '',
          data: {}
        }
        const oldRow = rowBlocksMap.current.get(row.uuid)
        if (!isEqual(oldRow, newRow)) {
          BrickdocEventBus.dispatch(UpdateBlock({ block: newRow }))
          rowBlocksMap.current.set(row.uuid, newRow)
        }
      }
    })
    BrickdocEventBus.dispatch(CommitBlocks({}))
  }, [parentId])

  const updateColumn = React.useCallback(
    (column: SpreadsheetColumn): void => {
      const oldColumns = latestColumns.current.filter(c => c.uuid !== column.uuid)
      latestColumns.current = [...oldColumns.slice(0, column.sort), column, ...oldColumns.slice(column.sort)].map(
        (c, i) => ({ ...c, sort: i })
      )
      updateSpreadsheetAttributes()
    },
    [updateSpreadsheetAttributes]
  )

  const addColumn = React.useCallback(
    (sort = -1): void => {
      const oldColumns = latestColumns.current
      const nextIdx = oldColumns.length === 0 ? 0 : oldColumns.map(c => c.idx).reduce((i, ci) => (ci > i ? ci : i)) + 1
      const newColumn = {
        uuid: uuid(),
        idx: nextIdx,
        sort: sort === -1 ? oldColumns.length : sort
      }
      updateColumn(newColumn)
    },
    [updateColumn]
  )

  const removeColumn = React.useCallback(
    (column: SpreadsheetColumn): void => {
      latestColumns.current = latestColumns.current
        .filter(c => c.uuid !== column.uuid)
        .map((c, i) => ({ ...c, sort: i }))
      updateSpreadsheetAttributes()
    },
    [updateSpreadsheetAttributes]
  )

  const addRow = React.useCallback(
    (index = -1): void => {
      const oldRows = latestRows.current
      const newIdx = index === -1 ? oldRows.length : index
      const row = {
        uuid: uuid(),
        cells: new Map<number, string>()
      }
      latestRows.current = [...oldRows.slice(0, newIdx), row, ...oldRows.slice(newIdx)]
      latestRowsCount.current += 1
      updateSpreadsheetAttributes()
      saveBlocks()
    },
    [updateSpreadsheetAttributes, saveBlocks]
  )

  const removeRow = React.useCallback(
    (index: number): void => {
      const oldRows = latestRows.current
      // const oldRow = latestRows.current[index]
      latestRows.current = [...oldRows.slice(0, index), ...oldRows.slice(index + 1)]
      latestRowsCount.current -= 1
      updateSpreadsheetAttributes()
      saveBlocks()
    },
    [updateSpreadsheetAttributes, saveBlocks]
  )

  const changeTitle = React.useCallback(
    (title: string): void => {
      latestTitle.current = title
      updateSpreadsheetAttributes()
    },
    [updateSpreadsheetAttributes]
  )

  const getCell = React.useCallback((rowIdx: number, columnIdx: number): string | undefined => {
    return latestRows.current[rowIdx]?.cells.get(columnIdx)
  }, [])

  const setCell = React.useCallback(
    (rowIdx: number, columnIdx: number, value: string): void => {
      let row = latestRows.current[rowIdx]
      if (!row) {
        row = {
          uuid: uuid(),
          cells: new Map<number, string>()
        }
        latestRows.current[rowIdx] = row
      }
      row.cells.set(columnIdx, value)
      saveBlocks()
    },
    [saveBlocks]
  )

  React.useEffect(() => {
    if (loaded.current) {
      if (latestColumns.current.length === 0 && latestRowsCount.current === 0) {
        addColumn()
        addColumn()
        addRow()
        addRow()
        addRow()
      }
    } else {
      BrickdocEventBus.dispatch(loadSpreadsheetBlocks(parentId))
    }
  }, [parentId, latestColumns, addColumn, latestRowsCount, addRow])

  return {
    columns: latestColumns.current,
    addColumn,
    updateColumn,
    removeColumn,
    addRow,
    removeRow,
    title: latestTitle.current,
    changeTitle,
    rowsCount: latestRowsCount.current,
    rows: latestRows.current,
    getCell,
    setCell
  }
}
