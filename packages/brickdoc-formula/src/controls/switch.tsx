import { BrickdocEventBus, FormulaInnerRefresh } from '@brickdoc/schema'
import { SwitchInitializer, SwitchType } from '.'
import { FunctionContext, FunctionResult, functionResult2lambda, VariableMetadata } from '..'

export class SwitchClass implements SwitchType {
  isSelected: boolean
  meta: VariableMetadata
  kind: 'Switch' = 'Switch'
  fn: FunctionResult
  disabled: boolean
  onChange?: (bool: boolean) => void

  constructor(ctx: FunctionContext, { isSelected, fn }: SwitchInitializer) {
    this.isSelected = isSelected
    this.meta = ctx.meta
    this.fn = fn
    this.disabled = false
    this.onChange = value => {
      functionResult2lambda(ctx, fn, this)()
      this.isSelected = value
      BrickdocEventBus.dispatch(
        FormulaInnerRefresh({ namespaceId: ctx.meta.namespaceId, variableId: ctx.meta.variableId })
      )
    }
  }
}
