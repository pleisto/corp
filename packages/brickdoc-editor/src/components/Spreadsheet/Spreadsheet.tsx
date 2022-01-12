import React from 'react'
import { NodeViewProps } from '@tiptap/react'
import { Button, Input } from '@brickdoc/design-system'
import { BlockContainer } from '../BlockContainer'
import { useSpreadsheet } from './useSpreadsheet'
import { columnDisplayTitle } from './helper'

import { SpreadsheetCell } from './SpreadsheetCell'
import './Spreadsheet.less'

export const Spreadsheet: React.FC<NodeViewProps> = ({ editor, node, deleteNode, updateAttributes }) => {
  const parentId: string = node.attrs.uuid
  const prevData = node.attrs.data || {}

  const [title, setTitle] = React.useState<string>(node.text ?? '')

  const updateAttributeData = (data: Record<string, any>): void => {
    updateAttributes({
      data: { ...prevData, ...data }
    })
  }

  const { columns, addColumn, updateColumn, removeColumn, rows, addRow, removeRow, getCellBlock, saveCellBlock } =
    useSpreadsheet({
      parentId,
      data: prevData,
      updateAttributeData
    })

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const title = event.target.value
    // TODO: save title to node.text
    setTitle(title)
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
          {rows.map((rowBlock, rowIdx) => {
            return (
              <tr key={rowIdx}>
                {columns.map((column, columnIdx) => {
                  const block = getCellBlock(rowBlock.id, column.uuid)
                  return <SpreadsheetCell key={block.id} block={block} saveBlock={saveCellBlock} />
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
