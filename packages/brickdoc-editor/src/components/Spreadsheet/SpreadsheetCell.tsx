import React from 'react'

import { Input } from '@brickdoc/design-system'
import { BlockInput } from '@brickdoc/schema'

export interface SpreadsheetCellProps {
  block: BlockInput
  saveBlock: (block: BlockInput) => void
}

export const SpreadsheetCell: React.FC<SpreadsheetCellProps> = ({ block, saveBlock }) => {
  const [cellBlock, setCellBlock] = React.useState<BlockInput>(block)
  const changeCellText = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newBlock = {
      ...cellBlock,
      text: event.target.value
    }
    saveBlock(newBlock)
    setCellBlock(newBlock)
  }
  return (
    <td>
      <Input value={cellBlock.text} onChange={changeCellText} />
    </td>
  )
}
