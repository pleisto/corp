import {
  BlockSpreadsheetLoaded,
  BrickdocEventBus,
  EventSubscribed,
  FormulaInnerRefresh,
  FormulaTaskCompleted,
  FormulaTickViaId,
  FormulaUpdatedViaId,
  FormulaUpdatedViaName
} from '@brickdoc/schema'
import {
  ContextInterface,
  VariableData,
  VariableInterface,
  VariableMetadata,
  AnyTypeResult,
  Definition,
  Formula,
  BaseFormula,
  FormulaSourceType,
  NamespaceId,
  VariableTask
} from '../types'
import { parse, interpretAsync } from '../grammar/core'
import { dumpValue } from './persist'
import { block2name, variable2name, variableKey } from '../grammar/convert'
import { BlockClass } from '../controls/block'
import { v4 as uuid } from 'uuid'

export const errorIsFatal = ({ task }: VariableData): boolean => {
  if (task.async) {
    return false
  }

  const { success, result } = task.variableValue
  if (
    !success &&
    result.type === 'Error' &&
    ['name_unique', 'name_check', 'name_invalid', 'fatal'].includes(result.errorKind)
  ) {
    return true
  }

  return false
}

export const fetchResult = ({ task }: VariableData): AnyTypeResult => {
  if (task.async) {
    const duration = new Date().getTime() - task.execStartTime.getTime()
    if (duration > 5000) {
      return { type: 'Pending', result: '[5s] Loading...' }
    }
    return { type: 'Pending', result: 'Loading...' }
  }

  return task.variableValue.result
}

export const castVariable = (
  oldVariable: VariableInterface | undefined,
  formulaContext: ContextInterface,
  { name, definition, cacheValue, version, blockId, id, type: unknownType }: BaseFormula
): VariableInterface => {
  // const oldVariable = formulaContext.findVariableById(blockId, id)
  const namespaceId = blockId
  const variableId = id
  const type = unknownType as FormulaSourceType
  const meta: VariableMetadata = { namespaceId, variableId, name, input: definition, position: 0, type }
  const ctx = { formulaContext, meta, interpretContext: { ctx: {}, arguments: [] } }
  const parseResult = parse({ ctx })

  const newVariable = interpretAsync({ variable: oldVariable, isLoad: true, ctx, parseResult })
  return newVariable
}

export class VariableClass implements VariableInterface {
  t: VariableData
  savedT: VariableData | undefined
  isNew: boolean
  formulaContext: ContextInterface

  tickTimeout: number = 1000
  eventListeners: EventSubscribed[] = []
  currentUUID: string | undefined
  builtinEventListeners: EventSubscribed[] = []

  constructor({ t, formulaContext }: { t: VariableData; formulaContext: ContextInterface }) {
    this.t = t
    this.formulaContext = formulaContext
    this.isNew = true

    const tickSubscription = BrickdocEventBus.subscribe(
      FormulaTickViaId,
      e => {
        void this.tick(e.payload.uuid)
      },
      {
        eventId: `${t.namespaceId},${t.variableId}`,
        subscribeId: `Tick#${t.namespaceId},${t.variableId}`
      }
    )
    this.builtinEventListeners.push(tickSubscription)

    const taskSubscription = BrickdocEventBus.subscribe(
      FormulaTaskCompleted,
      e => {
        void this.completeTask(e.payload)
      },
      {
        eventId: `${t.namespaceId},${t.variableId}`,
        subscribeId: `Task#${t.namespaceId},${t.variableId}`
      }
    )
    this.builtinEventListeners.push(taskSubscription)
  }

  public onUpdate(): void {
    BrickdocEventBus.dispatch(FormulaUpdatedViaId(this))
    BrickdocEventBus.dispatch(FormulaUpdatedViaName(this))
    this.trackDirty()
  }

  public trackDirty(): void {
    if (this.isNew) return
    this.formulaContext.dirtyFormulas[variableKey(this.t.namespaceId, this.t.variableId)] = {
      updatedAt: new Date()
    }
  }

  private async tick(uuid: string): Promise<void> {
    // if (this.currentUUID !== uuid) return
    // if (!this.t.async) return
    // // NOTE Frontend only
    // BrickdocEventBus.dispatch(FormulaUpdatedViaId(this))
    // await new Promise(resolve => setTimeout(resolve, this.tickTimeout))
    // BrickdocEventBus.dispatch(
    //   FormulaTickViaId({ uuid: this.currentUUID, variableId: this.t.variableId, namespaceId: this.t.namespaceId })
    // )
  }

  private completeTask({ uuid }: VariableTask): void {
    if (this.t.task.uuid === uuid || this.savedT?.task.uuid === uuid) {
      this.onUpdate()
    }
  }

  public clearDependency(): void {
    this.unsubscripeEvents()

    this.t.variableDependencies.forEach(dependency => {
      const dependencyKey = variableKey(dependency.namespaceId, dependency.variableId)
      const variableDependencies = this.formulaContext.reverseVariableDependencies[dependencyKey]
        ? this.formulaContext.reverseVariableDependencies[dependencyKey].filter(
            x => !(x.namespaceId === this.t.namespaceId && x.variableId === this.t.variableId)
          )
        : []
      this.formulaContext.reverseVariableDependencies[dependencyKey] = [...variableDependencies]
    })

    this.t.functionDependencies.forEach(dependency => {
      const dependencyKey = dependency.key
      const functionDependencies = this.formulaContext.reverseFunctionDependencies[dependencyKey]
        ? this.formulaContext.reverseFunctionDependencies[dependencyKey].filter(
            x => !(x.namespaceId === this.t.namespaceId && x.variableId === this.t.variableId)
          )
        : []
      this.formulaContext.reverseFunctionDependencies[dependencyKey] = [...functionDependencies]
    })
  }

  public trackDependency(): void {
    this.subscripeEvents()

    this.formulaContext.formulaNames = this.formulaContext.formulaNames
      .filter(n => !(n.kind === 'Variable' && n.key === this.t.variableId))
      .concat(variable2name(this))

    if (
      !this.formulaContext.formulaNames.find(n => n.kind === 'Block' && n.key === this.t.namespaceId) &&
      this.t.type === 'normal'
    ) {
      const block = new BlockClass(this.formulaContext, { id: this.t.namespaceId })
      this.formulaContext.formulaNames.push({ ...block2name(block), name: 'Untitled' })
    }

    this.t.variableDependencies.forEach(dependency => {
      const dependencyKey = variableKey(dependency.namespaceId, dependency.variableId)
      this.formulaContext.reverseVariableDependencies[dependencyKey] ||= []
      this.formulaContext.reverseVariableDependencies[dependencyKey] = [
        ...this.formulaContext.reverseVariableDependencies[dependencyKey].filter(
          ({ namespaceId, variableId }) => !(namespaceId === this.t.namespaceId && variableId === this.t.variableId)
        ),
        { namespaceId: this.t.namespaceId, variableId: this.t.variableId }
      ]
    })

    this.t.functionDependencies.forEach(dependency => {
      const dependencyKey = dependency.key
      this.formulaContext.reverseFunctionDependencies[dependencyKey] ||= []
      this.formulaContext.reverseFunctionDependencies[dependencyKey] = [
        ...this.formulaContext.reverseFunctionDependencies[dependencyKey].filter(
          ({ namespaceId, variableId }) => !(namespaceId === this.t.namespaceId && variableId === this.t.variableId)
        ),
        { namespaceId: this.t.namespaceId, variableId: this.t.variableId }
      ]
    })
  }

  namespaceName(pageId: NamespaceId): string {
    // if (this.t.namespaceId === pageId) {
    //   return 'Current Page'
    // }
    const formulaName = this.formulaContext.formulaNames.find(n => n.key === this.t.namespaceId && n.kind === 'Block')
    if (formulaName) {
      return formulaName.name
    }

    return 'Unknown'
  }

  meta(): VariableMetadata {
    return {
      namespaceId: this.t.namespaceId,
      variableId: this.t.variableId,
      name: this.t.name,
      position: 0,
      input: this.t.definition,
      type: this.t.type
    }
  }

  save(): void {
    this.formulaContext.commitVariable({ variable: this })
  }

  public buildFormula(): Formula {
    return {
      blockId: this.t.namespaceId,
      definition: this.t.definition,
      id: this.t.variableId,
      name: this.t.name,
      version: this.t.version,
      type: this.t.type,
      cacheValue: dumpValue(fetchResult(this.t))
    }
  }

  private async maybeReparseAndPersist(sourceUuid: string): Promise<void> {
    if (this.currentUUID === sourceUuid) {
      return
    }
    this.currentUUID = sourceUuid

    const formula = this.buildFormula()
    this.clearDependency()
    castVariable(this, this.formulaContext, formula)
    this.trackDependency()
  }

  public async updateDefinition(definition: Definition): Promise<void> {
    this.t.definition = definition
    await this.maybeReparseAndPersist(uuid())
  }

  private subscripeEvents(): void {
    const t = this.t
    const innerRefreshSubscription = BrickdocEventBus.subscribe(
      FormulaInnerRefresh,
      e => {
        this.onUpdate()
      },
      { eventId: `${t.namespaceId},${t.variableId}`, subscribeId: `InnerRefresh#${t.variableId}` }
    )
    this.eventListeners.push(innerRefreshSubscription)

    t.blockDependencies.forEach(blockId => {
      const result = BrickdocEventBus.subscribe(
        BlockSpreadsheetLoaded,
        e => {
          void this.maybeReparseAndPersist(e.payload.id)
        },
        { eventId: blockId, subscribeId: `SpreadsheetDependency#${t.variableId}` }
      )
      this.eventListeners.push(result)
    })

    t.variableDependencies.forEach(({ variableId, namespaceId }) => {
      const result = BrickdocEventBus.subscribe(
        FormulaUpdatedViaId,
        e => {
          if (e.payload.isNew) return
          void this.maybeReparseAndPersist(e.payload.t.variableId)
        },
        {
          eventId: `${namespaceId},${variableId}`,
          subscribeId: `Dependency#${t.namespaceId},${t.variableId}`
        }
      )
      this.eventListeners.push(result)
    })

    t.variableNameDependencies.forEach(({ name, namespaceId }) => {
      const result = BrickdocEventBus.subscribe(
        FormulaUpdatedViaName,
        e => {
          if (e.payload.isNew) return
          void this.maybeReparseAndPersist(e.payload.t.variableId)
        },
        {
          eventId: `${namespaceId}#${name}`,
          subscribeId: `Dependency#${t.namespaceId},${t.variableId}`
        }
      )
      this.eventListeners.push(result)
    })
  }

  private unsubscripeEvents(): void {
    this.eventListeners.forEach(listener => {
      listener.unsubscribe()
    })
    this.eventListeners = []
  }
}
