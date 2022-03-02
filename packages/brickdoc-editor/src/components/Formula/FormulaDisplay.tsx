import React from 'react'
import { Icon } from '@brickdoc/design-system'
import {
  ButtonResult,
  InputResult,
  SpreadsheetResult,
  StringResult,
  FormulaSourceType,
  VariableDisplayData
} from '@brickdoc/formula'
import { FormulaValue } from './FormulaValue'
import { FormulaInput } from './Render/FormulaInput'
import { FormulaQrcode } from './Render/FormulaQrcode'
import { FormulaButton } from './Render/FormulaButton'
import { FormulaLiteral } from './Render/FormulaLiteral'
import { FormulaSpreadsheet } from './Render/FormulaSpreadsheet'

export interface FormulaDisplayProps {
  displayData?: VariableDisplayData
  display?: string
  formulaType: FormulaSourceType
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ displayData, display, formulaType, ...props }) => {
  if (!displayData) {
    if (formulaType === 'normal') {
      return (
        <span {...props} className="brickdoc-formula-placeholder">
          <Icon.Formula className="brickdoc-formula-placeholder-icon" />
        </span>
      )
    }
    return <div />
  }

  const { result, kind, type } = displayData

  if (kind === 'literal') {
    return (
      <span {...props}>
        <FormulaLiteral result={result} formulaType={type} />
      </span>
    )
  }

  let preview: React.ReactElement | null = <></>

  switch (result.view?.type ?? result.type) {
    case 'Button':
      preview = <FormulaButton result={result as ButtonResult} formulaType={type} />
      break
    case 'Input':
      preview = <FormulaInput result={result as InputResult} formulaType={type} />
      break
    case 'Spreadsheet':
      preview = <FormulaSpreadsheet result={result as SpreadsheetResult} formulaType={type} />
      break
    case 'Qrcode':
      preview = <FormulaQrcode result={result as StringResult} formulaType={type} />
      break
    default:
      break
  }

  return (
    <>
      <span {...props}>
        <FormulaValue displayData={displayData} display={display!} border={true} />
      </span>
      {preview}
    </>
  )
}
