import React from 'react'
import { SpreadsheetType, SpreadsheetClass, ColumnInitializer, Row, CellType } from '@brickdoc/formula'
import { BlockInput, BrickdocEventBus, SpreadsheetUpdateNameViaId, SpreadsheetUpdateViaName } from '@brickdoc/schema'
import { SpreadsheetColumn } from './useSpreadsheet'
import { columnDisplayTitle } from './helper'
import { useExternalProps } from '../../../hooks/useExternalProps'

interface useFormulaSpreadsheetProps {
  spreadsheetId: string
  columns: SpreadsheetColumn[]
  rows: BlockInput[]
  getCellBlock: (rowId: string, columnId: string) => BlockInput
  title: string
}

export function useFormulaSpreadsheet({
  spreadsheetId,
  columns,
  rows,
  title,
  getCellBlock
}: useFormulaSpreadsheetProps): void {
  const externalProps = useExternalProps()
  const formulaContext = externalProps.formulaContext
  const rootId = externalProps.rootId
  const titleRef = React.useRef(title)

  React.useEffect(() => {
    BrickdocEventBus.dispatch(
      SpreadsheetUpdateViaName({
        spreadsheetId,
        name: title,
        namespaceId: rootId
      })
    )
    BrickdocEventBus.dispatch(
      SpreadsheetUpdateNameViaId({
        spreadsheetId,
        name: title,
        namespaceId: rootId
      })
    )
  }, [rootId, spreadsheetId, title])

  React.useEffect(() => {
    if (!formulaContext) return
    const spreadsheetName = titleRef.current
    const columnData: ColumnInitializer[] = columns.map((column, index) => ({
      columnId: column.uuid,
      spreadsheetId,
      name: columnDisplayTitle(column),
      // index: column.sort
      index
    }))

    const rowData: Row[] = rows.map((row, rowIndex) => ({ rowId: row.id, rowIndex, spreadsheetId }))

    const spreadsheet: SpreadsheetType = new SpreadsheetClass({
      ctx: { formulaContext },
      namespaceId: rootId,
      spreadsheetId,
      dynamic: false,
      name: spreadsheetName,
      listColumns: () => columnData,
      listRows: () => rowData,
      listCells: ({ rowId, columnId }) => {
        const rowIdsWithIndex = rows.map((row, index) => ({ rowId: row.id, rowIndex: index }))
        const columnIdsWithIndex = columns.map((column, index) => ({ columnId: column.uuid, columnIndex: index }))

        const finalRowIdsWithIndex = rowId ? rowIdsWithIndex.filter(row => row.rowId === rowId) : rowIdsWithIndex
        const finalColumnIdsWithIndex = columnId
          ? columnIdsWithIndex.filter(column => column.columnId === columnId)
          : columnIdsWithIndex

        return finalRowIdsWithIndex.flatMap(({ rowId, rowIndex }) =>
          finalColumnIdsWithIndex.map(({ columnId, columnIndex }) => {
            const cellBlock = getCellBlock(rowId, columnId)
            const cell: CellType = {
              spreadsheetId,
              columnId,
              rowIndex,
              columnIndex,
              rowId,
              cellId: cellBlock.id,
              value: cellBlock.text,
              displayData: cellBlock.data.displayData
            }
            return cell
          })
        )
      }
    })

    formulaContext.setSpreadsheet(spreadsheet)
    return () => {
      formulaContext.removeSpreadsheet(spreadsheetId)
    }
  }, [rootId, spreadsheetId, columns, rows, formulaContext, getCellBlock])
}
