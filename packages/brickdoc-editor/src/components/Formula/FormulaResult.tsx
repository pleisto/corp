import React from 'react'
import { displayValue, ErrorMessage, VariableInterface } from '@brickdoc/formula'
import './FormulaMenu.less'

export interface FormulaResultProps {
  variable: VariableInterface | undefined
}

export const FormulaResult: React.FC<FormulaResultProps> = ({ variable }) => {
  if (!variable) {
    return <></>
  }

  const variableValue = variable.t.variableValue

  const error: ErrorMessage | undefined = variableValue.success
    ? undefined
    : { message: variableValue.result.result, type: variableValue.result.errorKind }

  return (
    <>
      <div className="formula-menu-result">
        {error && (
          <span className="formula-menu-result-error">
            <span className="formula-menu-result-error-type">{error.type}</span>
            <span className="formula-menu-result-error-message">{error.message}</span>
          </span>
        )}
        {!error && displayValue(variableValue.result)}
      </div>
      <div className="formula-menu-divider" />
    </>
  )
}
