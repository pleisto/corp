import React from 'react'
import { v4 as uuid } from 'uuid'
import cx from 'classnames'
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useTable, Column, HeaderGroup, useFlexLayout, TableHeaderProps, useResizeColumns, TableHeaderGroupProps } from 'react-table'
import { Button, Icon } from '@brickdoc/design-system'
import { ColumnMenu } from './ColumnMenu'
import './Table.css'

const ADD_NEW_COLUMN_ID = '__addColumn'
const DEFAULT_GROUP_ID = '__defaultGroup'

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

export const Table: React.FC<NodeViewProps> = () => {
  const [columns, setColumns] = React.useState<Column[]>([
    {
      id: DEFAULT_GROUP_ID,
      columns: [
        {
          Header: 'Task name',
          accessor: uuid()
        },
        {
          Header: 'Due date',
          accessor: uuid()
        }
      ]
    }
  ])

  const removeColumn = (groupId: string, columnId: string): void => {
    setColumns(prevColumns =>
      prevColumns.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            columns: ((group as any).columns as Column[]).filter(column => {
              if (column.accessor === columnId) {
                return false
              }

              return true
            })
          }
        }

        return group
      })
    )
  }

  const updateColumn = (value: string, groupId: string, columnId: string): void =>
    setColumns(prevColumns =>
      prevColumns.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            columns: ((group as any).columns as Column[]).map(column => {
              if (column.accessor === columnId) {
                return {
                  ...column,
                  Header: value
                }
              }

              return column
            })
          }
        }

        return group
      })
    )

  const addNewColumn = (): void => {
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
                accessor: uuid()
              }
            ]
          }
        }

        return group
      })
    })
  }

  const [activeCells, setActiveCells] = React.useState<Array<[number, number] | number>>([])
  const isRowActive = (rowIndex: number): boolean => activeCells.includes(rowIndex)
  const isCellActive = (rowIndex: number, cellIndex: number): boolean =>
    activeCells.some(active => {
      if (typeof active === 'number') return false
      return active[0] === rowIndex && (active[1] === -1 || active[1] === cellIndex)
    })

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 180 // width is used for both the flex-basis and flex-grow
    }),
    []
  )
  const [data, setData] = React.useState<object[]>([
    {
      taskName: 'taskName',
      dueDate: 'dueDate'
    }
  ])

  const addNewRow = (rowIndex: number): void => {
    setActiveCells([rowIndex + 1])
    setData(prevData => [...prevData.slice(0, rowIndex), {}, ...prevData.slice(rowIndex, prevData.length)])
  }

  const AddNewColumnButton = React.useCallback(
    () => (
      <Button type="text" className="table-block-add-column-button" onClick={addNewColumn}>
        <Icon name="plus" />
      </Button>
    ),
    []
  )

  const AddNewColumnCell = React.useCallback(() => <div />, [])

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data, defaultColumn },
    useFlexLayout,
    useResizeColumns,
    hooks => {
      hooks.visibleColumns.push(columns => [
        ...columns,
        {
          id: ADD_NEW_COLUMN_ID,
          Header: AddNewColumnButton,
          Cell: AddNewColumnCell
        }
      ])
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
