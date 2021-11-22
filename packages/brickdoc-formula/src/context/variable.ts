import { interpret, VariableData, VariableMetadata } from '..'
import { BackendActions, FormulaContext } from '../context'

type UpdateHandler = (data: VariableData) => void
export class Variable {
  t: VariableData
  updateHandler: UpdateHandler
  backendActions: BackendActions

  constructor({ t }: { t: VariableData }) {
    this.t = t
  }

  public meta = (): VariableMetadata => {
    return {
      namespaceId: this.t.namespaceId,
      variableId: this.t.variableId,
      name: this.t.name,
      input: this.t.definition
    }
  }

  public onUpdate = (handler: UpdateHandler) => {
    this.updateHandler = handler
  }

  public invokeBackendCreate = () => {
    if (this.backendActions) {
      void this.backendActions.createVariable(this)
    }
  }

  public invokeBackendUpdate = () => {
    if (this.backendActions) {
      void this.backendActions.updateVariable(this)
    }
  }

  public afterUpdate = (): void => {
    // console.log({ label: 'after update', name: this.t.name, result: this.t.variableValue })
    if (this.updateHandler) {
      this.updateHandler(this.t)
    }
  }

  public refresh = (formulaContext: FormulaContext): void => {
    const { result } = interpret({ cst: this.t.cst, formulaContext, meta: this.meta() })

    // console.log({ label: 'refresh', name: this.t.name, result })
    this.t = { ...this.t, variableValue: result }
    this.afterUpdate()
    this.invokeBackendUpdate()
  }
}
