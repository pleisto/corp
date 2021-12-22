import { FormulaControlType, FunctionResult, VariableMetadata } from '..'

export interface ControlType {
  meta: VariableMetadata
  kind: FormulaControlType
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ControlInitializer {}
export interface ButtonType extends ControlType {
  kind: 'Button'
  name: string
  fn: FunctionResult
  disabled: boolean
  onClick?: () => void
}

export interface ButtonInitializer extends ControlInitializer {
  name: string
  fn: FunctionResult
}

export interface SwitchType extends ControlType {
  kind: 'Switch'
  isSelected: boolean
  fn: FunctionResult
  disabled: boolean
  onChange?: (bool: boolean) => void
}

export interface SwitchInitializer extends ControlInitializer {
  isSelected: boolean
  fn: FunctionResult
}
