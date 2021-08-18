import React from 'react'
import { Column } from 'react-table'
import { v4 as uuid } from 'uuid'

export const DEFAULT_GROUP_ID = '__defaultGroup'

export interface DatabaseColumn {
  key: string
  title: string
  type: string
  // group: string
}

export interface DatabaseColumns extends Array<DatabaseColumn> {}

export const databaseColumnsToTableColumns = (databaseColumns: DatabaseColumns) =>
  Object.entries(
    databaseColumns.reduce((r: { [group: string]: Column[] }, dbColumn: DatabaseColumn) => {
      const group = DEFAULT_GROUP_ID
      r[group] = [
        ...(r[group] || []),
        {
          accessor: dbColumn.key,
          Header: dbColumn.title
        }
      ] as Column[]
      return r
    }, {})
  ).map(([group, columns]) => ({ id: group, columns }))

export function useColumns(options: { databaseColumns: DatabaseColumns; updateAttributes: (attributes: Record<string, any>) => void }): [
  Column[],
  {
    setColumns: (fn: (prevColumns: DatabaseColumns) => DatabaseColumns) => void
    remove: (groupId: string, columnId: string) => void
    update: (value: string, groupId: string, columnId: string) => void
    add: () => void
  }
] {
  const { databaseColumns, updateAttributes } = options

  const latestDatabaseColumns = React.useRef<DatabaseColumns>(databaseColumns)
  const latestColumns = React.useRef<Column[]>(databaseColumnsToTableColumns(latestDatabaseColumns.current))

  const setColumns = (fn: (prevColumns: DatabaseColumns) => DatabaseColumns) => {
    latestDatabaseColumns.current = fn(latestDatabaseColumns.current)
    latestColumns.current = databaseColumnsToTableColumns(latestDatabaseColumns.current)
    updateAttributes({ columns: latestDatabaseColumns.current })
  }

  const remove = (groupId: string, columnId: string) => setColumns(prevColumns => prevColumns.filter(dbColumn => dbColumn.key !== columnId))

  const update = (value: string, groupId: string, columnId: string) =>
    setColumns(prevColumns => prevColumns.map(dbColumn => (dbColumn.key === columnId ? { ...dbColumn, title: value } : dbColumn)))

  const add = () =>
    setColumns(prevColumns => [
      ...prevColumns,
      {
        key: uuid(),
        title: `Column${prevColumns.length}`,
        type: 'text'
      }
    ])

  return [latestColumns.current, { add, update, remove, setColumns }]
}
