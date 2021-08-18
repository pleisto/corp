import React from 'react'
import { v4 as uuid } from 'uuid'
import cx from 'classnames'
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useTable, HeaderGroup, useFlexLayout, TableHeaderProps, useResizeColumns, TableHeaderGroupProps, Column } from 'react-table'
import { Button, Icon } from '@brickdoc/design-system'
import { ColumnMenu } from './ColumnMenu'
// import { useColumns } from './useColumns'
import { useAddNewColumn, COLUMN_ID as ADD_NEW_COLUMN_ID } from './useAddNewColumn'
import { useActiveStatus } from './useActiveStatus'
import './Table.css'

export const DEFAULT_GROUP_ID = '__defaultGroup'

export interface DatabaseColumn {
  key: string
  title: string
  type: string
  // group: string
}

interface DatabaseColumns extends Array<DatabaseColumn> {}

const isGroupedHeader = (headerGroup: HeaderGroup): boolean => headerGroup.headers?.[0].depth !== 0 || !!headerGroup.Header

const getStyles = (props: Partial<TableHeaderProps>, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'center',
      display: 'inline-flex'
    }
  }
]
const headerPropsGetter = (props: Partial<TableHeaderGroupProps>, { column }: any) => getStyles(props, column.align)
const cellPropsGetter = (props: Partial<TableHeaderGroupProps>, { cell }: any) => getStyles(props, cell.column.align)

const defaultColumnMeta = {
  minWidth: 30, // minWidth is only used as a limit for resizing
  width: 180 // width is used for both the flex-basis and flex-grow
}

const databaseColumnsToTableColumns = (databaseColumns: DatabaseColumns) =>
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


export const Table: React.FC<NodeViewProps> = ({ node, updateAttributes }) => {
  const latestDatabaseColumns = React.useRef<DatabaseColumns>(node.attrs.columns)
  const latestColumns = React.useRef<Column[]>(databaseColumnsToTableColumns(latestDatabaseColumns.current))

  const setColumns = (fn: (prevColumns: DatabaseColumns) => DatabaseColumns): void => {
    latestDatabaseColumns.current = fn(latestDatabaseColumns.current)
    latestColumns.current = databaseColumnsToTableColumns(latestDatabaseColumns.current)
    updateAttributes({ columns: latestDatabaseColumns.current })
  }

  const addNewColumn = React.useCallback(() =>
    setColumns(prevColumns =>[
      ...prevColumns,
      {
        key: uuid(),
        title: `Column${prevColumns.length}`,
        type: 'text'
      }
    ]),
    []
  )

  const updateColumn = React.useCallback((value: string, groupId: string, columnId: string) =>
    setColumns(prevColumns =>
      prevColumns.map(dbColumn => (dbColumn.key === columnId ? { ...dbColumn, title: value } : dbColumn))
    ),
    []
  )

  const removeColumn = React.useCallback((groupId: string, columnId: string) =>
    setColumns(prevColumns =>
      prevColumns.filter(dbColumn => dbColumn.key !== columnId)
    ),
    []
  )

  const columns = latestColumns.current

  const [{ isCellActive, isRowActive, updateActiveStatus }] = useActiveStatus()
  const [data, setData] = React.useState<object[]>([
    {
      taskName: 'taskName',
      dueDate: 'dueDate'
    }
  ])

  const addNewRow = (rowIndex: number): void => {
    updateActiveStatus([rowIndex + 1])
    setData(prevData => [...prevData.slice(0, rowIndex), {}, ...prevData.slice(rowIndex, prevData.length)])
  }

  const addNewColColumn = useAddNewColumn(addNewColumn)
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data, defaultColumn: defaultColumnMeta },
    useFlexLayout,
    useResizeColumns,
    hooks => {
      hooks.visibleColumns.push(columns => [...columns, addNewColColumn])
    }
  )

  return (
    <NodeViewWrapper
      ref={(container: HTMLDivElement) => {
        // TODO: need a better way to add this class
        container?.parentElement?.classList.add('table-block-react-renderer')
      }}>
      <div className="brickdoc-table-block">
        <div {...getTableProps({ className: 'table-block-table', style: { minWidth: '700px' }, role: 'table' })}>
          <div className="table-block-row">
            {headerGroups.filter(isGroupedHeader).map(headerGroup => {
              const headerGroupProps = headerGroup.getHeaderGroupProps({
                className: 'table-block-tr'
              })
              return (
                <div {...headerGroupProps} style={{ ...headerGroupProps.style, display: 'inline-flex' }} key={headerGroupProps.key}>
                  {headerGroup.headers.map(column => {
                    const headerProps = column.getHeaderProps(headerPropsGetter)
                    const Header = (
                      <div {...headerProps} className="table-block-th">
                        {column.render('Header')}
                        {column.canResize && (
                          <div {...column.getResizerProps()} className={cx('resizer', { isResizing: column.isResizing })} />
                        )}
                      </div>
                    )
                    if (column.id === ADD_NEW_COLUMN_ID) {
                      return Header
                    }

                    return (
                      <ColumnMenu
                        key={column.id}
                        columnName={column.Header as string}
                        onColumnNameChange={e => updateColumn(e.target.value, column.parent?.id ?? '', column.id)}
                        onRemoveColumn={() => removeColumn(column.parent?.id ?? '', column.id)}>
                        {Header}
                      </ColumnMenu>
                    )
                  })}
                </div>
              )
            })}
          </div>
          <div className="table-block-tbody">
            {rows.map((row, rowIndex) => {
              prepareRow(row)
              const rowProps = row.getRowProps({ className: 'table-block-tr' })
              return (
                <div className={cx('table-block-row', { active: isRowActive(rowIndex) })} key={rowProps.key}>
                  <div data-testid="table-actions" className="table-block-row-actions">
                    <Button onClick={() => addNewRow(rowIndex)} className="table-block-row-action-button" type="text">
                      <Icon name="plus" />
                    </Button>
                  </div>
                  <div {...rowProps} style={{ ...rowProps.style, display: 'inline-flex' }}>
                    {row.cells.map((cell, cellIndex) => {
                      const cellProps = cell.getCellProps(cellPropsGetter)
                      return (
                        <div
                          {...cellProps}
                          key={cellProps.key}
                          className={cx('table-block-td', { active: isCellActive(rowIndex, cellIndex) })}>
                          {cell.render('Cell')}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  )
}
