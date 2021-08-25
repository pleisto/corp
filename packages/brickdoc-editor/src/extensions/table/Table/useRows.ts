import React from 'react'
import { v4 as uuid } from 'uuid'

export interface DatabaseRows extends Array<object> {}

const defaultRows = (databaseRows: DatabaseRows): DatabaseRows => {
  if ((databaseRows || []).length === 0) {
    return [
      {
        id: uuid()
      }
    ]
  }

  return databaseRows
}

export function useRows(options: { databaseRows: DatabaseRows; updateAttributeData: (attributes: Record<string, any>) => void }): [
  DatabaseRows,
  {
    updateRows: (fn: (prevRows: DatabaseRows) => DatabaseRows) => void
  }
] {
  const { databaseRows, updateAttributeData } = options

  const latestDatabaseRows = React.useRef<DatabaseRows>(defaultRows(databaseRows))

  const updateRows = (fn: (prevRows: DatabaseRows) => DatabaseRows): void => {
    latestDatabaseRows.current = fn(latestDatabaseRows.current)
    // TODO: convert rows to children nodes
    updateAttributeData({ rows: latestDatabaseRows.current })
  }

  return [latestDatabaseRows.current, { updateRows }]
}
