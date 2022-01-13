import React from 'react'
import { NodeViewProps } from '@tiptap/react'
import { Button, Input, Icon } from '@brickdoc/design-system'
import { useEditorI18n } from '../../hooks'

import { BlockContainer, BlockContainerProps } from '../BlockContainer'

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

  const { t } = useEditorI18n()

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

  const actionOptions: BlockContainerProps['actionOptions'] = ['delete']

  return (
    <BlockContainer deleteNode={deleteNode} actionOptions={actionOptions}>
      <span>
        <SpreadsheetContainer>
          <Input value={title} placeholder="Untitled Spreadsheet" onChange={handleTitleChange} />
          <SpreadsheetView>
            <SpreadsheetHeader>
              <SpreadsheetHeaderColumn className="row-action-panel">
                <div className="row-action-panel-layer">
                  <Button onClick={() => addColumn(0)}>+</Button>
                </div>
              </SpreadsheetHeaderColumn>
              {columns.map((column, i) => {
                const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
                  updateColumn({ ...column, title: event.target.value })
                }
                return (
                  <SpreadsheetHeaderColumn key={column.uuid}>
                    <Button size="small" onClick={() => addColumn(i + 1)}>
                      +
                    </Button>
                    <Button size="small" onClick={() => removeColumn(column)}>
                      x
                    </Button>
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
                    rowNumber={`${rowIdx + 1}`}
                    rowActions={[
                      {
                        name: 'addRowAbove',
                        title: t('spreadsheet.row.add_above'),
                        icon: <Icon.ArrowUp />,
                        onAction: () => addRow(rowIdx)
                      },
                      {
                        name: 'addRowBelow',
                        title: t('spreadsheet.row.add_below'),
                        icon: <Icon.ArrowDown />,
                        onAction: () => addRow(rowIdx + 1)
                      },
                      {
                        name: 'deleteRow',
                        title: t('spreadsheet.row.delete'),
                        icon: <Icon.Delete />,
                        onAction: () => removeRow(rowIdx)
                      }
                    ]}
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
              <SpreadsheetRow rowNumber="+">
                <td colSpan={columns.length}>
                  <Button onClick={() => addRow()}>+</Button>
                </td>
              </SpreadsheetRow>
            </SpreadsheetBody>
          </SpreadsheetView>
        </SpreadsheetContainer>
      </span>
    </BlockContainer>
  )
}
