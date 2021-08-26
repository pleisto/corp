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
  const latestDatabaseRows = React.useRef<DatabaseRows>([])

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
      latestDatabaseRows.current = await fetchDatabaseRows()
    })()
  })

  const updateRows = (fn: (prevRows: DatabaseRows) => DatabaseRows): void => {
    // const prevRowsMap = Object.fromEntries((latestDatabaseRows.current.map(
    //   (row: DatabaseRow) => [row.id, row]
    // )))

    latestDatabaseRows.current = fn(latestDatabaseRows.current)
    // TODO: convert rows to children nodes
    latestDatabaseRows.current.forEach(row => {
      const { id, ...data } = row
      void saveDatabaseRow({ parentId, id, data })
    })
  }
  return [latestDatabaseRows.current, { updateRows }]
}
