import React from 'react'

import { BlockInput } from '@brickdoc/schema'
import { FormulaBlockRender } from '../../extensions/formula/FormulaBlock/FormulaBlockRender'
import { displayValue, VariableInterface } from '@brickdoc/formula'
import { SpreadsheetContext } from './SpreadsheetContext'

export interface SpreadsheetCellProps {
  context: SpreadsheetContext
  block: BlockInput
  parentId: string
  saveBlock: (block: BlockInput) => void
}

export const SpreadsheetCell: React.FC<SpreadsheetCellProps> = ({ context, parentId, block, saveBlock }) => {
  const [editing, setEditing] = React.useState(false)

  const formulaId = block.data.formulaId
  const formulaName = `${block.parentId}_${block.data.columnId}`

  const handleDelete = (): void => {}
  const updateFormula = (variable: VariableInterface): void => {
    saveBlock({
      ...block,
      text: displayValue(variable.t.variableValue.result)
    })
    // console.log('updateFormula', { variable, parentId, formulaId })
    setEditing(false)
  }

  const handleEnterEdit = (): void => {
    context.clearSelection()
    setEditing(true)
  }

  return editing ? (
    <FormulaBlockRender
      defaultVisible={true}
      formulaName={formulaName}
      rootId={parentId}
      formulaId={formulaId}
      handleDelete={handleDelete}
      updateFormula={updateFormula}
      formulaType="spreadsheet"
    />
  ) : (
    <div className="cell" onDoubleClick={handleEnterEdit}>
      {block.text}
    </div>
  )
}
