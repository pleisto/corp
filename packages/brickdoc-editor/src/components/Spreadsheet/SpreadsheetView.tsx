import React from 'react'

import { Dropdown, Menu, Button } from '@brickdoc/design-system'

import { useEditorI18n } from '../../hooks'

import { MenuIcon } from '../SlashMenu/styled'

export interface SpreadsheetActionItem {
  name: string
  title?: string
  icon?: React.ReactElement
  onAction?: (key: React.Key) => void
}

export const SpreadsheetMenu = (options: {
  items: SpreadsheetActionItem[]
  onAction?: (key: string) => void
}): JSX.Element => {
  const { items, onAction } = options
  return (
    <Menu>
      {items.map(item => {
        const title = item.title ?? item.name
        return (
          <Menu.Item
            key={item.name}
            itemKey={item.name}
            icon={<MenuIcon>{item.icon}</MenuIcon>}
            label={title}
            onAction={key => {
              item.onAction?.(key)
              onAction?.(key)
            }}
          >
            {title}
          </Menu.Item>
        )
      })}
    </Menu>
  )
}

export const SpreadsheetContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="brickdoc-spreadsheet-block">{children}</div>
}

export const SpreadsheetView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <table>{children}</table>
}

export const SpreadsheetHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  )
}

export const SpreadsheetHeaderColumn: React.FC<{
  children?: React.ReactNode
  className?: string
  columnActions?: SpreadsheetActionItem[]
}> = ({ children, className = '', columnActions }) => {
  const { t } = useEditorI18n()
  const [selected, setSelected] = React.useState(false)
  const [dropdownVisible, setDropdownVisible] = React.useState(false)

  const onDropdownVisibleChange = (value: boolean): void => {
    setDropdownVisible(value)
    setSelected(value)
  }

  return (
    <th className={`${selected ? 'selected' : ''} ${className}`}>
      {children}
      {columnActions ? (
        <Dropdown
          className="column-action"
          trigger={['click', 'contextMenu']}
          overlay={SpreadsheetMenu({
            items: columnActions,
            onAction: key => setDropdownVisible(false)
          })}
          visible={dropdownVisible}
          onVisibleChange={onDropdownVisibleChange}
          aria-label={t('spreadsheet.column.actions')}
        >
          <span>⌄</span>
        </Dropdown>
      ) : (
        ''
      )}
    </th>
  )
}

export const SpreadsheetBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <tbody>{children}</tbody>
}

export const SpreadsheetRow: React.FC<{
  children: React.ReactNode
  rowNumber?: string
  rowActions?: SpreadsheetActionItem[]
}> = ({ children, rowNumber, rowActions }) => {
  const { t } = useEditorI18n()
  const [selected, setSelected] = React.useState(false)
  const [dropdownVisible, setDropdownVisible] = React.useState(false)

  const onDropdownVisibleChange = (value: boolean): void => {
    setDropdownVisible(value)
    if (value) {
      selectRow()
    }
  }

  const onClickRowNumber = (e: { preventDefault: () => void; stopPropagation: () => void }): void => {
    e.preventDefault()
    e.stopPropagation()
    selectRow()
  }

  const unselectRow = (): void => {
    setSelected(false)
    document.removeEventListener('mousedown', unselectRow)
  }

  const selectRow = (): void => {
    setSelected(true)
    document.addEventListener('mousedown', unselectRow)
  }

  return (
    <tr className={selected ? 'selected' : ''}>
      <td className="row-action-panel">
        <div className="row-action-panel-layer">
          <Button className="row-number" onClick={onClickRowNumber}>
            {rowNumber}
          </Button>
          {rowActions ? (
            <Dropdown
              className="row-action"
              trigger={['click', 'contextMenu']}
              overlay={SpreadsheetMenu({
                items: rowActions,
                onAction: key => setDropdownVisible(false)
              })}
              visible={dropdownVisible}
              onVisibleChange={onDropdownVisibleChange}
              aria-label={t('spreadsheet.row.actions')}
            >
              <span>⌄</span>
            </Dropdown>
          ) : (
            ''
          )}
        </div>
      </td>
      {children}
    </tr>
  )
}

export const SpreadsheetCellContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <td>{children}</td>
}
