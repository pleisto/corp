import React from 'react'

import { BlockInput } from '@brickdoc/schema'
import { FormulaBlockRender } from '../Formula/FormulaBlockRender'
import { displayValue, VariableInterface } from '@brickdoc/formula'
import { SpreadsheetContext } from './SpreadsheetContext'
import { FormulaRender } from '../Formula/FormulaRender'

export interface SpreadsheetCellProps {
  context: SpreadsheetContext
  block: BlockInput
  parentId: string
  saveBlock: (block: BlockInput) => void
}

export const SpreadsheetCell: React.FC<SpreadsheetCellProps> = ({ context, parentId, block, saveBlock }) => {
  const [editing, setEditing] = React.useState(false)
  const [currentBlock, setCurrentBlock] = React.useState(block)

  const formulaId = currentBlock.data.formulaId
  const formulaName = `${currentBlock.parentId}_${currentBlock.data.columnId}`

  const handleDelete = React.useCallback((): void => {}, [])
  const updateFormula = React.useCallback(
    (variable: VariableInterface | undefined): void => {
      if (variable) {
        const newBlock = {
          ...block,
          data: { ...block.data, t: variable.result() },
          text: displayValue(variable.t.variableValue.result)
        }
        setCurrentBlock(newBlock)
        saveBlock(newBlock)
      }
      // console.log('updateFormula', { variable, block, newBlock, parentId, formulaId })
      setEditing(false)
    },
    [block, saveBlock]
  )

  const handleEnterEdit = (): void => {
    context.clearSelection()
    setEditing(true)
  }

  console.log('render cell', { context, parentId, block, saveBlock })

  if (editing) {
    return (
      <FormulaBlockRender
        defaultVisible={true}
        saveOnBlur={true}
        formulaName={formulaName}
        rootId={parentId}
        formulaId={formulaId}
        handleDelete={handleDelete}
        updateFormula={updateFormula}
        formulaType="spreadsheet"
      />
    )
  }

  return (
    <div className="cell" onDoubleClick={handleEnterEdit}>
      <FormulaRender t={currentBlock.data.t} formulaType="spreadsheet" />
    </div>
  )
}
