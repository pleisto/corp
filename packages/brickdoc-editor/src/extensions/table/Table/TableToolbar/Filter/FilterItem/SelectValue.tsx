import React from 'react'
import { Select, Tag } from '@brickdoc/design-system'
import { bgColor } from '../../../Cells/SelectCell'

export interface SelectValueProps {
  value?: string
  onChange: (value: string) => void
  options: Array<{
    label: string
    color: string
    value: string
  }>
}

export const SelectValue: React.FC<SelectValueProps> = ({ value, onChange, options }) => {
  return (
    <Select className="table-filter-option-select" value={value} onChange={onChange}>
      {options.map(option => (
        <Select.Option key={option.value} value={option.value}>
          <Tag color={bgColor(option.color)} style={{ color: option.color }}>
            {option.label}
          </Tag>
        </Select.Option>
      ))}
    </Select>
  )
}
