import React from 'react'

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
  rowActions?: React.ReactNode
}> = ({ children, rowNumber, rowActions }) => {
  return (
    <tr>
      <td className="row-action-panel">
        <div className="row-action-panel-layer">
          <div
            style={{
              position: 'absolute',
              right: '40px'
            }}
          >
            {rowActions}
          </div>
          <div className="row-number">{rowNumber}</div>
        </div>
      </td>
      {children}
    </tr>
  )
}

export const SpreadsheetCellContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <td>{children}</td>
}
