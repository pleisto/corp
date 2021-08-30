import React from 'react'
import { Column } from 'react-table'
import { Button, Icon } from '@brickdoc/design-system'
import { Filter, FilterOption, FilterGroupOption } from './Filter'

export interface TableToolbarProps {
  onAddNewRow: VoidFunction
  columns: Array<Column<object>>
  filterGroup: FilterGroupOption
  addFilter: (isGroup: boolean, path?: number[] | undefined) => void
  removeFilter: (path: number[]) => void
  updateFilter: (filter: Partial<FilterOption>, path: number[]) => void
  duplicateFilter: (path: number[]) => void
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  columns,
  onAddNewRow,
  filterGroup,
  addFilter,
  removeFilter,
  updateFilter,
  duplicateFilter
}) => {
  const [visible, setVisible] = React.useState(false)

  return (
    <Filter
      columns={columns}
      visible={visible}
      onVisibleChange={visible => setVisible(visible)}
      filterGroup={filterGroup}
      onAdd={addFilter}
      onRemove={removeFilter}
      onUpdate={updateFilter}
      onDuplicate={duplicateFilter}>
      <div role="toolbar" className="table-block-toolbar">
        <Button onClick={() => setVisible(true)} type="text" className="table-toolbar-text-button">
          Filter
        </Button>
        <Button type="primary" className="table-toolbar-add-button" onClick={() => onAddNewRow()}>
          New <Icon.ArrowRight />
        </Button>
      </div>
    </Filter>
  )
}
