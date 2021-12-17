import {
  ContextInterface,
  interpret,
  VariableUpdateHandler,
  VariableData,
  VariableInterface,
  VariableMetadata
} from '..'

export class VariableClass implements VariableInterface {
  t: VariableData
  formulaContext: ContextInterface
  updateHandler: VariableUpdateHandler | undefined

  constructor({ t, formulaContext }: { t: VariableData; formulaContext: ContextInterface }) {
    this.t = t
    this.formulaContext = formulaContext
  }

  public namespaceName = () => this.formulaContext.blockNameMap[this.t.namespaceId] || 'Untitled'

  public meta = (): VariableMetadata => {
    return {
      namespaceId: this.t.namespaceId,
      variableId: this.t.variableId,
      name: this.t.name,
      input: this.t.definition
    }
  }

  public onUpdate = (handler: VariableUpdateHandler): void => {
    this.updateHandler = handler
  }

  public invokeBackendCreate = async (): Promise<void> => {
    if (this.formulaContext.backendActions) {
      await this.formulaContext.backendActions.createVariable(this)
    }
  }

  public invokeBackendUpdate = async (): Promise<void> => {
    if (this.formulaContext.backendActions) {
      await this.formulaContext.backendActions.updateVariable(this)
    }
  }

  public afterUpdate = (): void => {
    if (this.updateHandler) {
      this.updateHandler(this)
    }
  }

  public refresh = async (): Promise<void> => {
    const { variableValue } = await interpret({
      cst: this.t.cst,
      formulaContext: this.formulaContext,
      meta: this.meta()
    })

    this.t = { ...this.t, variableValue }
    this.afterUpdate()
    await this.invokeBackendUpdate()
  }
}
