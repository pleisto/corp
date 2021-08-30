import React from 'react'
import cx from 'classnames'
import { v4 as uuid } from 'uuid'
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useTable, HeaderGroup, useFlexLayout, useResizeColumns, TableHeaderGroupProps } from 'react-table'
import { Modal } from '@brickdoc/design-system'
import { TableExtensionOptions } from '../../table'
import { ColumnMenu } from './ColumnMenu'
import { useColumns } from './useColumns'
import { useRows } from './useRows'
import { useAddNewColumn, COLUMN_ID as ADD_NEW_COLUMN_ID } from './useAddNewColumn'
import { useActiveStatus } from './useActiveStatus'
import { Cell } from './Cells/Cell'
import { TableRow } from './TableRow'
import './Table.css'
import { TableToolbar } from './TableToolbar'
import { useFilter } from './TableToolbar/Filter/useFilter'

const isGroupedHeader = (headerGroup: HeaderGroup): boolean => headerGroup.headers?.[0].depth !== 0 || !!headerGroup.Header

const headerPropsGetter = (props: Partial<TableHeaderGroupProps>, { column }: any): Array<Partial<TableHeaderGroupProps>> => [
  props,
  {
    style: {
      justifyContent: column.align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'center',
      display: 'inline-flex'
    }
  }
]

const defaultColumnConfig = {
  minWidth: 30, // minWidth is only used as a limit for resizing
  width: 180, // width is used for both the flex-basis and flex-grow
  Cell
}

export const Table: React.FC<NodeViewProps> = ({ node, extension, updateAttributes }) => {
  const parentId: string = node.attrs.uuid
  const prevData = node.attrs.data || {}

  const tableOptions: TableExtensionOptions = extension.options
  const { getDatabaseRows, saveDatabaseRow } = tableOptions

  const updateAttributeData = (data: Record<string, any>) => {
    updateAttributes({
      data: { ...(prevData || {}), ...data }
    })
  }

  const [columns, { setColumns, add: addNewColumn, remove: removeColumn, updateName: updateColumnName, updateType: updateColumnType }] =
    useColumns({
      databaseColumns: prevData.columns,
      updateAttributeData
    })

  const [{ isCellActive, isRowActive, update: updateActiveStatus, reset: resetActiveStatus }] = useActiveStatus()

  const [tableRows, { updateRows }] = useRows({
    parentId,
    getDatabaseRows,
    saveDatabaseRow
  })

  const updateData = (rowIndex: number, key: string, data: any): void => {
    updateRows(prevRows =>
      prevRows.map((item, rIndex) => {
        if (rIndex !== rowIndex) return item

        return {
          ...item,
          [key]: data
        }
      })
    )
  }

  const addNewRow = (rowIndex?: number): void => {
    updateRows(prevRows => {
      const currentRowIndex = rowIndex ?? prevRows.length - 1
      updateActiveStatus([{ rowIndex: currentRowIndex + 1 }])
      return [...prevRows.slice(0, currentRowIndex + 1), { id: uuid() }, ...prevRows.slice(currentRowIndex + 1, prevRows.length)]
    })
  }

  const removeRow = (rowIndex: number): void => {
    resetActiveStatus()
    updateRows(prevRows => prevRows.filter((_, index) => index !== rowIndex))
  }

  const [modal, contextHolder] = Modal.useModal()

  const removeRowConfirm = (rowIndex: number): void => {
    modal.confirm({
      title: 'Are you sure you want to delete this property?',
      okText: 'Delete',
      cancelText: 'Cancel',
      icon: null,
      onOk: () => removeRow(rowIndex)
    })
  }

  const addNewColColumn = useAddNewColumn(addNewColumn)

  const [filterGroup, { filter, add: addNewFilter, remove: removeFilter, update: updateFilter, duplicate: duplicateFilter }] = useFilter({
    type: 'group',
    collectionType: 'intersection',
    filters: []
  })

  // filter
  const data = React.useMemo(() => tableRows.filter(item => filter(item, filterGroup)), [tableRows, filterGroup, filter])

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data, defaultColumn: defaultColumnConfig, updateActiveStatus, resetActiveStatus, updateData, setColumns },
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
      {contextHolder}
      <TableToolbar
        onAddNewRow={addNewRow}
        columns={columns}
        filterGroup={filterGroup}
        addFilter={addNewFilter}
        removeFilter={removeFilter}
        updateFilter={updateFilter}
        duplicateFilter={duplicateFilter}
      />
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
                <TableRow
                  {...rowProps}
                  row={row}
                  rowActive={isRowActive(rowIndex)}
                  onAddNewRow={addNewRow}
                  onRemoveRow={removeRowConfirm}
                  isCellActive={isCellActive}
                  key={rowProps.key}
                />
              )
            })}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  )
}
