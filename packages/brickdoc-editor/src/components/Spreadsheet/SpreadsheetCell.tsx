import React from 'react'

import { BlockInput } from '@brickdoc/schema'
import { FormulaBlockRender } from '../../extensions/formula/FormulaBlock/FormulaBlockRender'
import { displayValue, VariableInterface } from '@brickdoc/formula'

export interface SpreadsheetCellProps {
  block: BlockInput
  parentId: string
  saveBlock: (block: BlockInput) => void
}

export const SpreadsheetCell: React.FC<SpreadsheetCellProps> = ({ parentId, block, saveBlock }) => {
  const formulaId = block.data.formulaId
  const formulaName = `${block.parentId}_${block.data.columnId}`

  const handleDelete = (): void => {}
  const updateFormula = (variable: VariableInterface): void => {
    saveBlock({
      ...block,
      text: displayValue(variable.t.variableValue.result)
    })
    console.log('updateFormula', { variable, parentId, formulaId })
  }

  return (
    <FormulaBlockRender
      formulaName={formulaName}
      rootId={parentId}
      formulaId={formulaId}
      handleDelete={handleDelete}
      updateFormula={updateFormula}
      formulaType="spreadsheet"
    />
  )
}
