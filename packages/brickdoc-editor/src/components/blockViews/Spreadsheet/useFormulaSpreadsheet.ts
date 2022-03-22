import React from 'react'
import { SpreadsheetType, SpreadsheetClass, ColumnInitializer, Row, CellType } from '@brickdoc/formula'
import { BlockInput } from '@brickdoc/schema'
import { SpreadsheetColumn } from './useSpreadsheet'
import { columnDisplayTitle } from './helper'
import { useExternalProps } from '../../../hooks/useExternalProps'

interface useFormulaSpreadsheetProps {
  blockId: string
  columns: SpreadsheetColumn[]
  rows: BlockInput[]
  getCellBlock: (rowId: string, columnId: string) => BlockInput
  title: string
}

export function useFormulaSpreadsheet({
  blockId,
  columns,
  rows,
  title,
  getCellBlock
}: useFormulaSpreadsheetProps): void {
  const externalProps = useExternalProps()
  const formulaContext = externalProps.formulaContext

  React.useEffect(() => {
    if (!formulaContext) return
    const spreadsheetName = title || 'Untitled Spreadsheet'
    const columnData: ColumnInitializer[] = columns.map(column => ({
      columnId: column.uuid,
      namespaceId: blockId,
      name: columnDisplayTitle(column),
      index: column.sort
    }))

    const rowData: Row[] = rows.map(row => ({ rowId: row.id }))

    const spreadsheet: SpreadsheetType = new SpreadsheetClass({
      ctx: { formulaContext },
      blockId,
      dynamic: false,
      name: spreadsheetName,
      listColumns: () => columnData,
      listRows: () => rowData,
      listCells: ({ rowId, columnId }) => {
        const finalRowIds = rowId ? [rowId] : rows.map(row => row.id)
        const finalColumnIds = columnId ? [columnId] : columns.map(column => column.uuid)

        return finalRowIds.flatMap(rowId =>
          finalColumnIds.map(columnId => {
            const cellBlock = getCellBlock(rowId, columnId)
            const cell: CellType = {
              columnId,
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
      formulaContext.removeSpreadsheet(blockId)
    }
  }, [blockId, title, columns, rows, formulaContext, getCellBlock])
}
