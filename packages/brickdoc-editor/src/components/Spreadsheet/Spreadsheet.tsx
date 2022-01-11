import React from 'react'
import { NodeViewProps } from '@tiptap/react'
import { Button, Input } from '@brickdoc/design-system'
import { BlockContainer } from '../BlockContainer'
import { useSpreadsheet } from './useSpreadsheet'
import { columnDisplayTitle } from './helper'

import './Spreadsheet.less'

export const Spreadsheet: React.FC<NodeViewProps> = ({ editor, node, deleteNode, updateAttributes }) => {
  const parentId: string = node.attrs.uuid
  const prevData = node.attrs.data || {}

  const updateAttributeData = (data: Record<string, any>): void => {
    updateAttributes({
      data: { ...prevData, ...data }
    })
  }

  const {
    columns,
    addColumn,
    updateColumn,
    removeColumn,
    rowsCount,
    rows,
    addRow,
    removeRow,
    title,
    changeTitle,
    getCell,
    setCell
  } = useSpreadsheet({
    parentId,
    data: prevData,
    updateAttributeData
  })

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    changeTitle(event.target.value)
  }

  return (
    <BlockContainer className="brickdoc-spreadsheet-block">
      <Input value={title} placeholder="Untitled Spreadsheet" onChange={handleTitleChange} />
      <table>
        <thead>
          <tr>
            {columns.map((column, i) => {
              const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
                updateColumn({ ...column, title: event.target.value })
              }
              return (
                <th key={column.uuid}>
                  <Button onClick={() => addColumn(i)}>+</Button>
                  <Button onClick={() => removeColumn(column)}>x</Button>
                  <Input value={columnDisplayTitle(column)} onChange={handleTitleChange} />
                </th>
              )
            })}
            <th>
              <Button onClick={() => addColumn()}>+</Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsCount)].map((_, rowIdx) => {
            const row = rows[rowIdx]
            return (
              <tr key={row?.uuid ?? rowIdx}>
                {columns.map((column, _) => {
                  const changeCell = (event: React.ChangeEvent<HTMLInputElement>): void => {
                    setCell(rowIdx, column.idx, event.target.value)
                  }
                  return (
                    <td key={column.idx}>
                      <Input value={getCell(rowIdx, column.idx)} onChange={changeCell} />
                    </td>
                  )
                })}
                <td>
                  <Button onClick={() => addRow(rowIdx)}>+</Button>
                  <Button onClick={() => removeRow(rowIdx)}>x</Button>
                </td>
              </tr>
            )
          })}
          <tr>
            <td colSpan={columns.length} />
            <td>
              <Button onClick={() => addRow()}>+</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </BlockContainer>
  )
}
