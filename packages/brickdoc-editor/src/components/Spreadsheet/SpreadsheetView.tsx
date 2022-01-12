import React from 'react'

import { BlockContainer } from '../BlockContainer'

export const SpreadsheetContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BlockContainer className="brickdoc-spreadsheet-block">{children}</BlockContainer>
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

export const SpreadsheetHeaderColumn: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <th>{children}</th>
}

export const SpreadsheetBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <tbody>{children}</tbody>
}

export const SpreadsheetRow: React.FC<{
  children: React.ReactNode
  rowIdx: number
  rowActions?: React.ReactNode
}> = ({ children, rowIdx, rowActions }) => {
  return (
    <tr>
      <td>
        {rowActions}#{rowIdx}
      </td>
      {children}
    </tr>
  )
}

export const SpreadsheetCellContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <td>{children}</td>
}
