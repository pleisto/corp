import React from 'react'
import cx from 'classnames'
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useTable, HeaderGroup, useFlexLayout, TableHeaderProps, useResizeColumns, TableHeaderGroupProps } from 'react-table'
import { Button, Icon } from '@brickdoc/design-system'
import { ColumnMenu } from './ColumnMenu'
import { useColumns } from './useColumns'
import { useRows } from './useRows'
import { useAddNewColumn, COLUMN_ID as ADD_NEW_COLUMN_ID } from './useAddNewColumn'
import { useActiveStatus } from './useActiveStatus'
import { Cell } from './Cells/Cell'
import './Table.css'

const isGroupedHeader = (headerGroup: HeaderGroup): boolean => headerGroup.headers?.[0].depth !== 0 || !!headerGroup.Header

const getStyles = (props: Partial<TableHeaderProps>, align = 'left'): Array<Partial<TableHeaderGroupProps>> => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'center',
      display: 'inline-flex'
    }
  }
]
const headerPropsGetter = (props: Partial<TableHeaderGroupProps>, { column }: any): Array<Partial<TableHeaderGroupProps>> =>
  getStyles(props, column.align)
const cellPropsGetter = (props: Partial<TableHeaderGroupProps>, { cell }: any): Array<Partial<TableHeaderGroupProps>> =>
  getStyles(props, cell.column.align)

const defaultColumnConfig = {
  minWidth: 30, // minWidth is only used as a limit for resizing
  width: 180, // width is used for both the flex-basis and flex-grow
  Cell
}

export const Table: React.FC<NodeViewProps> = ({ node, updateAttributes }) => {
  const [columns, { setColumns, add: addNewColumn, remove: removeColumn, updateName: updateColumnName, updateType: updateColumnType }] =
    useColumns({
      databaseColumns: node.attrs.columns,
      updateAttributes
    })

  const [{ isCellActive, isRowActive, update: updateActiveStatus, reset: resetActiveStatus }] = useActiveStatus()

  const [tableRows, { updateRows: setData }] = useRows({
    databaseRows: node.attrs.rows,
    updateAttributes
  })

  const updateData = (rowIndex: number, key: string, data: any): void => {
    setData(prevData =>
      prevData.map((item, rIndex) => {
        if (rIndex !== rowIndex) return item

        return {
          ...item,
          [key]: data
        }
      })
    )
  }

  const addNewRow = (rowIndex?: number): void => {
    setData(prevData => {
      const currentRowIndex = rowIndex ?? prevData.length - 1
      updateActiveStatus([{ rowIndex: currentRowIndex + 1 }])
      return [...prevData.slice(0, currentRowIndex + 1), {}, ...prevData.slice(currentRowIndex + 1, prevData.length)]
    })
  }

  const addNewColColumn = useAddNewColumn(addNewColumn)
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data: tableRows, defaultColumn: defaultColumnConfig, updateActiveStatus, resetActiveStatus, updateData, setColumns },
    useFlexLayout,
    useResizeColumns,
    hooks => {
      hooks.visibleColumns.push(columns => [...columns, addNewColColumn])
    }
  )

  return (
    <NodeViewWrapper
      className="table-block-node-view-wrapper"
      ref={(container: HTMLDivElement) => {
        // TODO: need a better way to add this class
        container?.parentElement?.classList.add('table-block-react-renderer')
        container?.classList.add('table-block-node-view-wrapper')
      }}>
      <div role="toolbar" className="table-block-toolbar">
        <Button type="primary" className="table-toolbar-add-button" onClick={() => addNewRow()}>
          New <Icon.ArrowRight />
        </Button>
      </div>
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
                        columnType={column.columnType}
                        onColumnNameChange={e => updateColumnName(e.target.value, column.parent?.id ?? '', column.id)}
                        onColumnTypeChange={type => updateColumnType(type, column.parent?.id ?? '', column.id)}
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
                      <Icon.Plus />
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
