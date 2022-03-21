import { BlockInitializer, BlockType } from './types'
import { AnyTypeResult, ContextInterface, NamespaceId } from '../types'

export class BlockClass implements BlockType {
  _formulaContext: ContextInterface
  name: (pageId: NamespaceId) => string
  id: NamespaceId

  constructor(_formulaContext: ContextInterface, { id }: BlockInitializer) {
    this._formulaContext = _formulaContext
    this.id = id
    this.name = (pageId: NamespaceId) => {
      // if (pageId === this.id) {
      //   return 'Current Page'
      // }
      const formulaName = this._formulaContext.formulaNames.find(n => n.key === id && n.kind === 'Block')
      if (formulaName) {
        return formulaName.name
      }

      return 'Unknown'
    }
  }

  persistence(): BlockInitializer {
    return {
      id: this.id
    }
  }

  async interpret(name: string): Promise<AnyTypeResult> {
    const variable = this._formulaContext.findVariableByName(this.id, name)
    if (!variable || !variable.savedT) {
      return { type: 'Error', result: `Variable "${name}" not found`, errorKind: 'runtime' }
    }

    if (variable.savedT.task.async) {
      return (await variable.savedT.task.variableValue).result
    } else {
      return variable.savedT.task.variableValue.result
    }
  }
}
