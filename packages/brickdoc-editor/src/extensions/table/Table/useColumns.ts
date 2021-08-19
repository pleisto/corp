import React from 'react'
import { Column } from 'react-table'
import { v4 as uuid } from 'uuid'

export const DEFAULT_GROUP_ID = '__defaultGroup'

export function useColumns(defaultColumns: Column[]): [
  Column[],
  {
    add: () => void
    remove: (groupId: string, columnId: string) => void
    updateName: (value: string, groupId: string, columnId: string) => void
    updateType: (type: string, groupId: string, columnId: string) => void
  }
] {
  const [columns, setColumns] = React.useState<Column[]>(defaultColumns)

  const removeFn = (groupId: string, columnId: string): void => {
    setColumns(prevColumns =>
      prevColumns.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            columns: ((group as any).columns as Column[]).filter(column => column.accessor !== columnId)
          }
        }

        return group
      })
    )
  }
  const remove = React.useCallback(removeFn, [])

  const updateNameFn = (value: string, groupId: string, columnId: string): void =>
    setColumns(prevColumns =>
      prevColumns.map(group => {
        if (group.id !== groupId) return group
        return {
          ...group,
          columns: ((group as any).columns as Column[]).map(column => ({
            ...column,
            Header: column.accessor === columnId ? value : column.Header
          }))
        }
      })
    )
  const updateName = React.useCallback(updateNameFn, [])

  const updateTypeFn = (type: string, groupId: string, columnId: string): void =>
    setColumns(prevColumns =>
      prevColumns.map(group => {
        if (group.id !== groupId) return group
        return {
          ...group,
          columns: ((group as any).columns as Column[]).map(column => {
            if (column.accessor !== columnId) return column

            return {
              columnSelectOptions: [],
              ...column,
              columnType: type
            }
          })
        }
      })
    )
  const updateType = React.useCallback(updateTypeFn, [])

  const addFn = (): void => {
    setColumns(prevColumns => {
      return prevColumns.map(group => {
        if (group.id === DEFAULT_GROUP_ID) {
          const columns: Column[] = (group as any).columns
          const label = 'Column'
          const existsCount = columns.filter(c => typeof c.Header === 'string' && c.Header.startsWith(label)).length
          const Header = `${label}${existsCount}`

          return {
            ...group,
            columns: [
              ...columns,
              {
                Header,
                accessor: uuid(),
                columnType: 'text',
                index: columns.length
              }
            ]
          }
        }

        return group
      })
    })
  }
  const add = React.useCallback(addFn, [])

  return [columns, { add, updateName, updateType, remove }]
}
