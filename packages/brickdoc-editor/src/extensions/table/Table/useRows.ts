import React from 'react'
import { TableExtensionOptions } from '../../table'

export interface DatabaseRow {
  id: string
  [key: string]: any
}
export interface DatabaseRows extends Array<DatabaseRow> {}

export function useRows(options: {
  parentId: string
  getDatabaseRows: TableExtensionOptions['getDatabaseRows']
  saveDatabaseRow: TableExtensionOptions['saveDatabaseRow']
}): [
  DatabaseRows,
  {
    updateRows: (fn: (prevRows: DatabaseRows) => DatabaseRows) => void
  }
] {
  const { parentId, getDatabaseRows, saveDatabaseRow } = options
  const [tableRows, setTableRows] = React.useState([] as DatabaseRows)

  const updateRows = React.useCallback(
    (fn: (prevRows: DatabaseRows) => DatabaseRows): void => {
      const newRows = fn(tableRows)
      newRows.forEach((row, i) => {
        const { id, ...data } = row
        void saveDatabaseRow({ parentId, id, data, sort: i })
      })
      setTableRows(newRows)
    },
    [tableRows, parentId, saveDatabaseRow]
  )

  const fetchDatabaseRows = async (): Promise<DatabaseRows> => {
    const resp = await getDatabaseRows(parentId, 0)
    if (resp.success) {
      return resp.data.map((block: DatabaseRow) => ({ ...block.data, id: block.id }))
    } else {
      return []
    }
  }

  React.useEffect(() => {
    void (async () => {
      const rows = await fetchDatabaseRows()
      setTableRows(rows)
    })()
  })

  return [tableRows, { updateRows }]
}
