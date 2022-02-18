import React from 'react'
import { displayValue, resultToColorType, VariableResult } from '@brickdoc/formula'
import './FormulaMenu.less'
import { FORMULA_COLORS } from '../../helpers'

export interface FormulaValueProps {
  t: VariableResult
  border?: boolean
}

export const FormulaValue: React.FC<FormulaValueProps> = ({ border, t: { variableValue, type } }) => {
  const activeColor = FORMULA_COLORS[resultToColorType(variableValue.result)]
  const hasBorder = type === 'normal' && border
  const text = displayValue(variableValue.result)

  if (!hasBorder) {
    return (
      <span
        className="brickdoc-formula-borderless"
        style={{
          color: activeColor.color,
          fontFamily: 'Fira Code'
        }}>
        {text}
      </span>
    )
  }

  return (
    <span
      className="brickdoc-formula"
      style={{
        color: activeColor.color,
        fontFamily: 'Fira Code',
        borderColor: `rgb(${activeColor.rgb.join(',')}, 0.3)`
      }}>
      {text}
    </span>
  )
}
