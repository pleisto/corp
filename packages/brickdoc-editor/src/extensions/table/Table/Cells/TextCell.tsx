import React from 'react'
import { CellProps } from 'react-table'
import { Input } from '@brickdoc/design-system'
import { useEditingStatus } from './useEditingStatus'
import './TextCell.css'

export interface TextCellProps extends CellProps<object> {}

export const TextCell: React.FC<TextCellProps> = props => {
  const { value, updateData, cell } = props
  const [editing, { show: showEditing, hide: hideEditing }] = useEditingStatus(props)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    updateData(cell.row.index, cell.column.id, event.target.value)
  }

  if (editing) {
    return (
      /* eslint-disable-next-line jsx-a11y/no-autofocus */
      <Input className="table-block-text-input" autoFocus={true} onBlur={hideEditing} value={value} onChange={handleChange} />
    )
  }

  return (
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    <div role="button" tabIndex={-1} className="table-block-text-cell" onClick={showEditing}>
      {value}
    </div>
  )
}
