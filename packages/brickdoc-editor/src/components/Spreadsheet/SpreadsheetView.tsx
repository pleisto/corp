import React from 'react'

import { Dropdown, Menu } from '@brickdoc/design-system'

import { useEditorI18n } from '../../hooks'

import { MenuIcon } from '../SlashMenu/styled'

export interface SpreadsheetActionItem {
  name: string
  title?: string
  icon?: React.ReactElement
  onAction?: (key: React.Key) => void
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

export const SpreadsheetHeaderColumn: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return <th className={className}>{children}</th>
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
  const [dropdownVisible, setDropdownVisible] = React.useState(false)

  const onDropdownVisibleChange = (value: boolean): void => {
    setDropdownVisible(value)
  }

  const menu = (
    <Menu>
      {rowActions?.map(item => {
        const title = item.title ?? item.name
        return (
          <Menu.Item
            key={item.name}
            itemKey={item.name}
            icon={<MenuIcon>{item.icon}</MenuIcon>}
            label={title}
            onAction={key => {
              item.onAction?.(key)
              setDropdownVisible(false)
            }}
          >
            {title}
          </Menu.Item>
        )
      })}
    </Menu>
  )

  return (
    <tr>
      <td className="row-action-panel">
        <div className="row-action-panel-layer">
          <div className="row-number">{rowNumber}</div>
          {rowActions?.length ? (
            <Dropdown
              className="row-action"
              trigger={['click', 'contextMenu']}
              overlay={menu}
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
