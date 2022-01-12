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
  sort: number
}

export interface SpreadsheetColumns extends Array<SpreadsheetColumn> {}

export interface SpreadsheetRows extends Array<BlockInput> {}

export interface SpreadsheetCellsMap extends Map<string, Map<string, BlockInput>> {}

export const useSpreadsheet = (options: {
  parentId: string
  data: Record<string, any>
  updateAttributeData: (data: Record<string, any>) => void
}): {
  columns: SpreadsheetColumns
  addColumn: (index?: number) => void
  updateColumn: (column: SpreadsheetColumn) => void
  removeColumn: (column: SpreadsheetColumn) => void
  rows: SpreadsheetRows
  addRow: (index?: number) => void
  removeRow: (index: number) => void
  getCellBlock: (rowId: string, columnId: string) => BlockInput
  saveCellBlock: (block: BlockInput) => void
  title: string
  changeTitle: (title: string) => void
} => {
  const { parentId, data, updateAttributeData } = options
  const columns = data.columns ?? []
  const latestColumns = React.useRef<SpreadsheetColumns>(columns)
  const latestRowsCount = React.useRef<number>(data.rowsCount || 0)
  // const latestRows = React.useRef<SpreadsheetRows>([])

  const [rows, setRows] = React.useState<SpreadsheetRows>([])

  const latestTitle = React.useRef<string>(data.title ?? '')

  const blocksMap = React.useRef<Map<string, BlockInput>>(new Map<string, BlockInput>())
  const cellsMap = React.useRef<SpreadsheetCellsMap>(new Map<string, Map<string, BlockInput>>())

  const updateSpreadsheetAttributes = React.useCallback((): void => {
    updateAttributeData({
      ...data,
      title: latestTitle.current,
      columns: latestColumns.current,
      rowsCount: latestRowsCount.current
    })
  }, [updateAttributeData, data])

  const loaded = React.useRef(false)

  const getRowBlock = React.useCallback(
    (index: number) => {
      return {
        id: uuid(),
        sort: index,
        type: 'spreadsheetRow',
        parentId,
        content: [],
        meta: {},
        text: '',
        data: {}
      }
    },
    [parentId]
  )

  const setBlockToCellsMap = (block: BlockInput): void => {
    const rowId = block.parentId
    if (rowId) {
      let rowCellsMap = cellsMap.current.get(rowId)
      if (!rowCellsMap) {
        rowCellsMap = new Map<string, BlockInput>()
        cellsMap.current.set(rowId, rowCellsMap)
      }
      rowCellsMap.set(block.data.columnId, block)
    }
  }

  BrickdocEventBus.subscribe(
    SpreadsheetBlocksLoaded,
    (e: Event) => {
      const { parentId, blocks } = e.payload
      console.log(`loaded spreadsheet ${parentId}`)
      console.log(blocks)
      const newRows = [...rows]
      blocks.forEach((block: BlockInput) => {
        blocksMap.current.set(block.id, block)
        if (block.type === 'spreadsheetRow') {
          newRows[block.sort] = block
        } else if (block.type === 'spreadsheetCell') {
          setBlockToCellsMap(block)
        }
      })
      setRows(newRows)
      loaded.current = true
    },
    { eventId: parentId, subscribeId: parentId }
  )

  const saveRowBlocks = React.useCallback(
    (newRows: SpreadsheetRows): void => {
      setRows(
        newRows
          .filter(b => typeof b !== 'undefined')
          .map((block, i) => {
            const oldBlock = blocksMap.current.get(block.id)
            const newBlock = { ...block, sort: i }
            if (!isEqual(oldBlock, newBlock)) {
              BrickdocEventBus.dispatch(UpdateBlock({ block: newBlock }))
              blocksMap.current.set(block.id, newBlock)
            }
            return newBlock
          })
      )
      latestRowsCount.current = newRows.length
      updateSpreadsheetAttributes()
      BrickdocEventBus.dispatch(CommitBlocks({}))
    },
    [updateSpreadsheetAttributes]
  )

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
      const newColumn = {
        uuid: uuid(),
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
      const oldRows = [...rows]
      const newIdx = index === -1 ? oldRows.length : index
      const row = getRowBlock(newIdx)
      saveRowBlocks([...oldRows.slice(0, newIdx), row, ...oldRows.slice(newIdx)])
    },
    [rows, saveRowBlocks, getRowBlock]
  )

  const removeRow = React.useCallback(
    (index: number): void => {
      const oldRows = [...rows]
      saveRowBlocks([...oldRows.slice(0, index), ...oldRows.slice(index + 1)])
    },
    [rows, saveRowBlocks]
  )

  const changeTitle = React.useCallback(
    (title: string): void => {
      latestTitle.current = title
      updateSpreadsheetAttributes()
    },
    [updateSpreadsheetAttributes]
  )

  const getCellBlock = (rowId: string, columnId: string): BlockInput => {
    let block = cellsMap.current.get(rowId)?.get(columnId)
    if (!block) {
      block = {
        id: uuid(),
        sort: 0,
        type: 'spreadsheetCell',
        parentId: rowId, // Save rowId to cell block parentId
        content: [],
        meta: {},
        text: '',
        data: { columnId }
      }
      setBlockToCellsMap(block)
    }
    return block
  }

  const saveCellBlock = React.useCallback((block: BlockInput): void => {
    console.log(`Saving cell block ${block.id}`)
    console.log(block)
    setBlockToCellsMap(block)
    BrickdocEventBus.dispatch(UpdateBlock({ block }))
    BrickdocEventBus.dispatch(CommitBlocks({}))
  }, [])

  React.useEffect(() => {
    if (loaded.current) {
      if (latestColumns.current.length === 0 && latestRowsCount.current === 0) {
        addColumn()
        addColumn()
        // addRow()
        // addRow()
        // addRow()
      }
    } else {
      BrickdocEventBus.dispatch(loadSpreadsheetBlocks(parentId))
    }
  }, [parentId, latestColumns, latestRowsCount, addColumn, addRow])

  return {
    columns: latestColumns.current,
    addColumn,
    updateColumn,
    removeColumn,
    rows,
    addRow,
    removeRow,
    getCellBlock,
    saveCellBlock,
    title: latestTitle.current,
    changeTitle
  }
}
