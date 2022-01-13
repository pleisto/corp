import React from 'react'

import { Input } from '@brickdoc/design-system'
import { BlockInput } from '@brickdoc/schema'

export interface SpreadsheetCellProps {
  block: BlockInput
  saveBlock: (block: BlockInput) => void
}

export const SpreadsheetCell: React.FC<SpreadsheetCellProps> = ({ block, saveBlock }) => {
  const [cellBlock, setCellBlock] = React.useState<BlockInput>(block)

  const updateCellBlack = (block: BlockInput): void => {
    saveBlock(block)
    setCellBlock(block)
  }

  const changeCellText = (event: React.ChangeEvent<HTMLInputElement>): void => {
    updateCellBlack({
      ...cellBlock,
      text: event.target.value
    })
  }

  return <Input className="cell" value={cellBlock.text} onChange={changeCellText} />
}
