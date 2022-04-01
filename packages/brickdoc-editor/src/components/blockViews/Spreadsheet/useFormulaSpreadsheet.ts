import React from 'react'
import { SpreadsheetType, SpreadsheetClass, ColumnInitializer, Row, CellType } from '@brickdoc/formula'
import { BlockInput, BrickdocEventBus, SpreadsheetUpdateNameViaId } from '@brickdoc/schema'
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
  title: originalTitle,
  getCellBlock
}: useFormulaSpreadsheetProps): {
  deleteSpreadsheet: () => void
} {
  const title = originalTitle || 'Untitled Spreadsheet'
  const externalProps = useExternalProps()
  const formulaContext = externalProps.formulaContext
  const rootId = externalProps.rootId
  const titleRef = React.useRef(title)
  const columnRef = React.useRef(columns)

  const columnData = columns.map(column => ({ columnId: column.uuid, sort: column.sort }))

  React.useEffect(() => {
    BrickdocEventBus.dispatch(
      SpreadsheetUpdateNameViaId({
        spreadsheetId,
        name: title,
        key: spreadsheetId,
        namespaceId: rootId
      })
    )
  }, [rootId, spreadsheetId, title])

  React.useEffect(() => {
    if (!formulaContext) return

    const spreadsheetName = titleRef.current
    const newColumn: ColumnInitializer[] = columnData.map(({ columnId, sort }, index) => ({
      columnId,
      spreadsheetId,
      name: columnDisplayTitle({
        uuid: columnId,
        sort,
        title: columnRef.current.find(c => c.uuid === columnId)?.title
      }),
      index
    }))

    const rowData: Row[] = rows.map((row, rowIndex) => ({ rowId: row.id, rowIndex, spreadsheetId }))

    const spreadsheet: SpreadsheetType = new SpreadsheetClass({
      ctx: { formulaContext },
      namespaceId: rootId,
      spreadsheetId,
      dynamic: false,
      name: spreadsheetName,
      columns: newColumn,
      rows: rowData,
      getCell: ({ rowId, columnId, rowIndex, columnIndex }) => {
        const cellBlock = getCellBlock(rowId, columnId)

        return {
          spreadsheetId,
          columnId,
          rowIndex,
          columnIndex,
          rowId,
          cellId: cellBlock.id,
          value: cellBlock.text,
          displayData: cellBlock.data.displayData
        }
      }
    })

    formulaContext.setSpreadsheet(spreadsheet)
    return () => {
      // formulaContext.removeSpreadsheet(spreadsheetId)
    }
  }, [rootId, spreadsheetId, columnData, rows, formulaContext, getCellBlock])

  return {
    deleteSpreadsheet: () => {
      formulaContext?.removeSpreadsheet(spreadsheetId, true)
    }
  }
}
