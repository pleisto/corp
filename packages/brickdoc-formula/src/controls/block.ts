import { BlockInitializer, BlockType } from './types'
import { AnyTypeResult, CodeFragment, ContextInterface, ErrorMessage, FormulaType, NamespaceId } from '../types'
import { CodeFragmentVisitor, spreadsheet2attrs, variable2attrs } from '../grammar'
import { fetchResult } from '../context/variable'
import { BlockNameLoad, BrickdocEventBus, EventSubscribed } from '@brickdoc/schema'

export class BlockClass implements BlockType {
  _formulaContext: ContextInterface
  name: (pageId: NamespaceId) => string
  id: NamespaceId
  _name: string
  eventListeners: EventSubscribed[] = []

  constructor(_formulaContext: ContextInterface, { id, name }: BlockInitializer) {
    this._formulaContext = _formulaContext
    this.id = id
    this._name = name ?? 'Untitled'
    this.name = (pageId: NamespaceId) => {
      return this._name
    }

    const blockNameSubscription = BrickdocEventBus.subscribe(
      BlockNameLoad,
      e => {
        this._name = e.payload.name
      },
      { subscribeId: `Block#${this.id}`, eventId: this.id }
    )

    this.eventListeners.push(blockNameSubscription)
  }

  persistence(): BlockInitializer {
    return {
      id: this.id,
      name: this._name
    }
  }

  public cleanup(): void {
    this.eventListeners.forEach(listener => {
      listener.unsubscribe()
    })
    this.eventListeners = []
  }

  async handleInterpret(name: string): Promise<AnyTypeResult> {
    const spreadsheet = this._formulaContext.findSpreadsheetByName(this.id, name)
    if (spreadsheet) {
      return { type: 'Spreadsheet', result: spreadsheet }
    }

    const variable = this._formulaContext.findVariableByName(this.id, name)
    if (!variable || !variable.savedT) {
      return { type: 'Error', result: `"${name}" not found`, errorKind: 'runtime' }
    }

    if (variable.savedT.task.async) {
      return (await variable.savedT.task.variableValue).result
    } else {
      return variable.savedT.task.variableValue.result
    }
  }

  handleCodeFragments(
    visitor: CodeFragmentVisitor,
    name: string,
    codeFragments: CodeFragment[]
  ): {
    errors: ErrorMessage[]
    firstArgumentType: FormulaType | undefined
    codeFragments: CodeFragment[]
  } {
    visitor.nameDependencies = [
      ...new Map(
        [...visitor.nameDependencies, { namespaceId: this.id, name }].map(item => [
          `${item.namespaceId},${item.name}`,
          item
        ])
      ).values()
    ]

    const spreadsheet = this._formulaContext.findSpreadsheetByName(this.id, name)
    if (spreadsheet) {
      let finalCodeFragments = codeFragments

      if (['StringLiteral', 'FunctionName'].includes(codeFragments[0].code)) {
        finalCodeFragments = [
          {
            ...codeFragments[0],
            display: name,
            code: 'Spreadsheet',
            attrs: spreadsheet2attrs(spreadsheet)
          }
        ]
      }

      return {
        errors: [],
        firstArgumentType: 'Spreadsheet',
        codeFragments: finalCodeFragments
      }
    }

    const variable = this._formulaContext.findVariableByName(this.id, name)
    const errors: ErrorMessage[] = []

    if (!variable) {
      errors.push({ type: 'deps', message: `"${name}" not found` })
      return {
        errors,
        firstArgumentType: undefined,
        codeFragments
      }
    }

    const firstArgumentType = fetchResult(variable.t).type

    if (variable.t.isAsync) {
      visitor.async = true
    }
    if (variable.t.isEffect) {
      visitor.effect = true
    }
    if (variable.t.isPersist) {
      visitor.persist = true
    }
    if (!variable.t.isPure) {
      visitor.pure = false
    }

    let finalCodeFragments = codeFragments

    if (['StringLiteral', 'FunctionName'].includes(codeFragments[0].code)) {
      finalCodeFragments = [
        {
          ...codeFragments[0],
          display: name,
          code: 'Variable',
          attrs: variable2attrs(variable)
        }
      ]
    }

    visitor.variableDependencies = [
      ...new Map(
        [...visitor.variableDependencies, { namespaceId: this.id, variableId: variable.t.variableId }].map(item => [
          item.variableId,
          item
        ])
      ).values()
    ]

    visitor.flattenVariableDependencies = [
      ...new Map(
        [
          ...visitor.flattenVariableDependencies,
          ...variable.t.flattenVariableDependencies,
          { namespaceId: this.id, variableId: variable.t.variableId }
        ].map(item => [item.variableId, item])
      ).values()
    ]

    return {
      errors,
      firstArgumentType,
      codeFragments: finalCodeFragments
    }
  }
}
