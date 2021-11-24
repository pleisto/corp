import React from 'react'
import { Column } from 'react-table'
import { DatabaseRows, TableBlockOptions } from '..'

export function useFormulaDatabase(
  blockId: string,
  tableColumns: Column[],
  tableData: DatabaseRows,
  getFormulaContext: TableBlockOptions['formulaContextActions']['getFormulaContext']
): void {
  // TODO pass column Type
  React.useEffect(() => {
    const formulaContext = getFormulaContext()
    formulaContext?.setDatabase(blockId, {
      size: () => tableData.length,
      listColumns: () => tableColumns,
      getCell: (columnId, rowId) => {
        const value = tableData.find(row => row.id === rowId)?.[columnId]

        return {
          value
        }
      },
      getColumnData: columnId =>
        tableData.map(row => ({
          value: row[columnId]
        })),
      getColumn: columnId => tableColumns.find(col => col.id === columnId)
    })

    return () => {
      const formulaContext = getFormulaContext()
      formulaContext?.removeDatabase(blockId)
    }
  }, [blockId, getFormulaContext, tableColumns, tableData])
}
