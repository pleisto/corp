import React from 'react'
import { v4 as uuid } from 'uuid'

export interface DatabaseRows extends Array<object> {}

export function useRows(options: { databaseRows: DatabaseRows; updateAttributes: (attributes: Record<string, any>) => void }): [
  DatabaseRows,
  {
    updateRows: (fn: (prevRows: DatabaseRows) => DatabaseRows) => void
  }
] {
  const { databaseRows, updateAttributes } = options

  const latestDatabaseRows = React.useRef<DatabaseRows>(databaseRows)

  const updateRows = (fn: (prevRows: DatabaseRows) => DatabaseRows): void => {
    latestDatabaseRows.current = fn(latestDatabaseRows.current)
    // TODO: convert rows to children nodes
    updateAttributes({ rows: latestDatabaseRows.current })
  }

  if (databaseRows.length === 0) {
    updateRows(prevRows => [
      ...prevRows,
      {
        id: uuid()
      }
    ])
  }

  return [latestDatabaseRows.current, { updateRows }]
}
