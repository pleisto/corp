import { Context, FunctionClause, namespaceId, VariableData, VariableDependency, variableId } from '..'
import { BUILTIN_CLAUSES } from '../functions'
import { Variable } from './variable'

export class FormulaContext {
  context: Context
  reverseVariableDependencies: { [key: string]: VariableDependency[] }
  reverseFunctionDependencies: { [key: string]: VariableDependency[] }
  functionClausesMap: { [key: string]: FunctionClause }

  constructor({ functionClauses }: { functionClauses: FunctionClause[] } = { functionClauses: [] }) {
    this.context = {}
    this.reverseVariableDependencies = {}
    this.reverseFunctionDependencies = {}
    this.functionClausesMap = [...BUILTIN_CLAUSES, ...functionClauses].reduce((o, acc) => {
      o[`${acc.group}${acc.name}`] = acc
      return o
    }, {})
  }

  public validateCircularReferences = () => {}

  public variableCount = (): number => {
    return Object.keys(this.context).length
  }

  public findVariable = (namespaceId: namespaceId, variableId: variableId): Variable | undefined => {
    return this.context[this.variableKey(namespaceId, variableId)]
  }

  public findVariableByName = (namespaceId: namespaceId, name: string): Variable | undefined => {
    return Object.values(this.context).find((v: Variable) => v.t.namespaceId === namespaceId && v.t.name === name)
  }

  public clearDependency = (namespaceId: namespaceId, variableId: variableId): void => {
    const variable = this.findVariable(namespaceId, variableId)
    if (variable) {
      variable.t.variableDependencies?.forEach(dependency => {
        const dependencyKey = this.variableKey(dependency.namespaceId, dependency.variableId)
        const variableDependencies = this.reverseVariableDependencies[dependencyKey]
          ? this.reverseVariableDependencies[dependencyKey].filter(x => !(x.namespaceId === namespaceId && x.variableId === variableId))
          : []
        this.reverseVariableDependencies[dependencyKey] = [...variableDependencies]
      })

      variable.t.functionDependencies?.forEach(dependency => {
        const dependencyKey = this.functionKey(dependency.group, dependency.name)
        const functionDependencies = this.reverseFunctionDependencies[dependencyKey]
          ? this.reverseFunctionDependencies[dependencyKey].filter(x => !(x.namespaceId === namespaceId && x.variableId === variableId))
          : []
        this.reverseFunctionDependencies[dependencyKey] = [...functionDependencies]
      })
    }
  }

  public trackDependency = ({ variableDependencies, namespaceId, variableId, functionDependencies }: VariableData): void => {
    variableDependencies?.forEach(dependency => {
      const dependencyKey = this.variableKey(dependency.namespaceId, dependency.variableId)
      this.reverseVariableDependencies[dependencyKey] ||= []
      this.reverseVariableDependencies[dependencyKey] = [...this.reverseVariableDependencies[dependencyKey], { namespaceId, variableId }]
    })

    functionDependencies?.forEach(dependency => {
      const dependencyKey = this.functionKey(dependency.group, dependency.name)
      this.reverseFunctionDependencies[dependencyKey] ||= []
      this.reverseFunctionDependencies[dependencyKey] = [...this.reverseFunctionDependencies[dependencyKey], { namespaceId, variableId }]
    })
  }

  public handleBroadcast = (variable: Variable): void => {
    const dependencyKey = this.variableKey(variable.t.namespaceId, variable.t.variableId)
    this.reverseVariableDependencies[dependencyKey]?.forEach(({ namespaceId, variableId }) => {
      this.context[this.variableKey(namespaceId, variableId)]!.refresh(this)
    })
  }

  // TODO update dependencies and check circular references
  public commitVariable = ({ variable, isNew }: { variable: Variable; isNew: boolean }): void => {
    const { namespaceId, variableId } = variable.t
    let shouldBroadcast = false
    if (!isNew) {
      void this.clearDependency(namespaceId, variableId)
      // const oldVariable: Variable = this.context[this.variableKey(namespaceId, variableId)]
      shouldBroadcast = true
    }
    this.context[this.variableKey(namespaceId, variableId)] = variable
    void this.trackDependency(variable.t)

    void variable.afterUpdate()

    if (shouldBroadcast) {
      void this.handleBroadcast(variable)
    }
  }

  public removeVariable = (namespaceId: namespaceId, variableId: variableId): void => {
    const key = this.variableKey(namespaceId, variableId)
    const variable = this.context[key]
    if (variable) {
      void this.clearDependency(namespaceId, variableId)
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.context[key]
    }
  }

  public findFunctionClause = (group: string, name: string): FunctionClause | undefined => {
    return this.functionClausesMap[`${group}${name}`]
  }

  public reset = (): void => {
    this.context = {}
    this.reverseVariableDependencies = {}
    this.reverseFunctionDependencies = {}
  }

  public variableKey = (namespaceId: namespaceId, variableId: variableId): string => {
    return `$${namespaceId}@${variableId}`
  }

  public functionKey = (group: string, name: string): string => {
    return `&${group}::${name}`
  }
}
