import React from 'react'
import { NodeViewProps } from '@tiptap/react'
import { Button, Input } from '@brickdoc/design-system'
import { BlockContainer } from '../BlockContainer'
import { useSpreadsheet } from './useSpreadsheet'
import { columnDisplayTitle } from './helper'

import {
  SpreadsheetContainer,
  SpreadsheetView,
  SpreadsheetHeader,
  SpreadsheetHeaderColumn,
  SpreadsheetBody,
  SpreadsheetRow,
  SpreadsheetCellContainer
} from './SpreadsheetView'

import { SpreadsheetCell } from './SpreadsheetCell'
import './Spreadsheet.less'

export const Spreadsheet: React.FC<NodeViewProps> = ({ editor, node, deleteNode, updateAttributes }) => {
  const parentId: string = node.attrs.uuid
  const prevData = node.attrs.data || {}

  const [title, setTitle] = React.useState<string>(node.attrs.title ?? '')

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
    updateAttributes({ title })
    console.log(title)
    setTitle(title)
  }

  return (
    <BlockContainer>
      <SpreadsheetContainer>
        <Input value={title} placeholder="Untitled Spreadsheet" onChange={handleTitleChange} />
        <SpreadsheetView>
          <SpreadsheetHeader>
            <SpreadsheetHeaderColumn>
              <Button onClick={() => addColumn(0)}>+</Button>
            </SpreadsheetHeaderColumn>
            {columns.map((column, i) => {
              const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
                updateColumn({ ...column, title: event.target.value })
              }
              return (
                <SpreadsheetHeaderColumn key={column.uuid}>
                  <Button onClick={() => addColumn(i + 1)}>+</Button>
                  <Button onClick={() => removeColumn(column)}>x</Button>
                  <br />
                  <Input value={columnDisplayTitle(column)} onChange={handleTitleChange} />
                </SpreadsheetHeaderColumn>
              )
            })}
          </SpreadsheetHeader>
          <SpreadsheetBody>
            {rows.map((rowBlock, rowIdx) => {
              return (
                <SpreadsheetRow
                  key={rowIdx}
                  rowIdx={rowIdx}
                  rowActions={
                    <div>
                      <Button onClick={() => addRow(rowIdx)}>+</Button>
                      <Button onClick={() => removeRow(rowIdx)}>x</Button>
                    </div>
                  }
                >
                  {columns.map((column, columnIdx) => {
                    const block = getCellBlock(rowBlock.id, column.uuid)
                    return (
                      <SpreadsheetCellContainer key={block.id}>
                        <SpreadsheetCell key={block.id} block={block} saveBlock={saveCellBlock} />
                      </SpreadsheetCellContainer>
                    )
                  })}
                </SpreadsheetRow>
              )
            })}
            <tr>
              <td>
                <Button onClick={() => addRow()}>+</Button>
              </td>
              <td colSpan={columns.length} />
            </tr>
          </SpreadsheetBody>
        </SpreadsheetView>
      </SpreadsheetContainer>
    </BlockContainer>
  )
}
