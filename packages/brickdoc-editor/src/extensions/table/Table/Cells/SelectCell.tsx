/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { v4 as uuid } from 'uuid'
import { Select, Tag, SelectProps, Modal } from '@brickdoc/design-system'
import { CellProps, TableColumnSelectOption } from 'react-table'
import { useEditingStatus } from './useEditingStatus'
import { SelectCellOption } from './SelectCellOption'
import { COLOR } from '../../../color'
import './SelectCell.css'

const randomColor = (): string => COLOR[Math.floor(Math.random() * COLOR.length)].color

export interface SelectCellProps extends CellProps<object> {}

export const bgColor = (color?: string): string => {
  const rgb = COLOR.find(item => item.color === color)?.rgb
  if (!rgb) return ''

  return `rgba(${rgb?.join(',')}, 0.15)`
}

export const SelectCell: React.FC<SelectCellProps> = props => {
  const { cell, value, updateData, column } = props
  const [modal, contextHolder] = Modal.useModal()
  const [editing, { show: showEditing, hide: hideEditing }] = useEditingStatus(props)

  const [options, setOptions] = React.useState<TableColumnSelectOption[]>(column.columnSelectOptions.map(item => ({ ...item })))
  const updateColumnOption = (option: TableColumnSelectOption): void => {
    const item = column.columnSelectOptions.find(item => item.value === option.value)
    if (item) {
      item.color = option.color
      item.label = option.label
    } else column.columnSelectOptions.push(option)
  }
  const isOptionExist = (options: TableColumnSelectOption[], value: string): boolean => options.some(item => item.value === value)

  const handleFilterOption: SelectProps<object>['filterOption'] = (inputValue, option) => {
    if (!inputValue) return true
    return (option?.title as string).includes(inputValue)
  }

  const handleColumnOptionChange = (option: TableColumnSelectOption): void => {
    setOptions(prevOptions => {
      updateColumnOption(option)
      return prevOptions.map(item => {
        if (item.value === option.value) return option
        return item
      })
    })
  }

  const handleColumnOptionRemove = (option: TableColumnSelectOption): void => {
    modal.confirm({
      title: 'Are you sure you want to delete this property?',
      okText: 'Delete',
      cancelText: 'Cancel',
      icon: null,
      onOk: () => {
        setOptions(prevOptions => {
          column.columnSelectOptions = column.columnSelectOptions.filter(item => item.value !== option.value)
          return prevOptions.filter(item => item.value !== option.value)
        })

        if (option.value === value) {
          updateData(cell.row.index, cell.column.id, null)
        }
      }
    })
  }

  const handleChange = (values: string[]): void => {
    const newValue = values[values.length - 1]?.trim()

    if (!newValue) return

    setOptions(prevOptions => {
      if (isOptionExist(prevOptions, newValue)) {
        updateData(cell.row.index, cell.column.id, newValue)
        return prevOptions
      }

      const newOption: TableColumnSelectOption = { label: newValue, color: randomColor(), value: uuid() }
      updateData(cell.row.index, cell.column.id, newOption.value)
      updateColumnOption(newOption)
      return [...prevOptions, newOption]
    })
  }

  const handleRemove = React.useCallback((): void => {
    updateData(cell.row.index, cell.column.id, null)
  }, [cell.row.index, cell.column.id, updateData])

  const OptionTag: SelectProps<object>['tagRender'] = React.useCallback(
    ({ value }) => {
      const color = options.find(item => item.value === value)?.color
      const label = column.columnSelectOptions.find(item => item.value === value)?.label
      return (
        <Tag className="table-block-select-cell-tag" style={{ color }} color={bgColor(color)} closable={true} onClose={handleRemove}>
          {label}
        </Tag>
      )
    },
    [options, handleRemove, column.columnSelectOptions]
  )

  const Dropdown: SelectProps<object>['dropdownRender'] = React.useCallback(
    menu => (
      <>
        <div className="table-block-select-dropdown-title">Select an option or create one</div>
        {menu}
      </>
    ),
    []
  )

  if (editing) {
    return (
      <>
        {contextHolder}
        <Select
          className="table-block-select"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={true}
          mode="tags"
          tagRender={OptionTag}
          optionFilterProp="title"
          filterOption={handleFilterOption}
          dropdownRender={Dropdown}
          dropdownClassName="select-cell-select-dropdown"
          value={[value].filter(i => !!i)}
          suffixIcon={false}
          menuItemSelectedIcon={false}
          placeholder="Search for option ..."
          showSearch={true}
          showAction={['focus', 'click']}
          open={true}
          onChange={handleChange}>
          {options.map(option => (
            <Select.Option className="select-cell-select-option" key={option.value} value={option.value} title={option.label}>
              <SelectCellOption onOptionValueChange={handleColumnOptionChange} onOptionRemove={handleColumnOptionRemove} option={option} />
            </Select.Option>
          ))}
        </Select>
        <div
          data-testid="table-select-overlay"
          className="table-block-select-cell-overlay"
          onClick={() => {
            hideEditing()
          }}
        />
      </>
    )
  }

  const color = options.find(item => item.value === value)?.color
  const label = column.columnSelectOptions.find(item => item.value === value)?.label

  return (
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    <div role="button" tabIndex={-1} className="table-block-select-cell" onClick={showEditing}>
      {label && (
        <Tag color={bgColor(color)} style={{ color }}>
          {label}
        </Tag>
      )}
    </div>
  )
}
