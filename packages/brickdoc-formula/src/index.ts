import { CstNode } from 'chevrotain'
import { FormulaContext, Variable } from './context'

export * from './grammar'
export * from './functions'
export * from './context'

export type ArgumentType = 'number' | 'string' | 'boolean' | 'Date' | 'array' | 'object' | 'any'

export type FunctionGroup = 'core' | 'excel' | 'custom'

export type VariableKind = 'constant' | 'expression'

export type VariableTypeMeta = `error_${VariableKind}` | `success_${VariableKind}_${ArgumentType}`

export type Result = any

export interface View {
  [key: string]: any
}

export interface Formula {
  blockId: uuid
  definition: string
  id: uuid
  name: string
  type: ArgumentType
  updatedAt: string
  createdAt: number
  value: string
  view: View
}

export interface Argument {
  readonly name: string
  readonly type: ArgumentType
  readonly spread?: boolean
}

export interface Example {
  readonly input: any[]
  readonly output: Result
}

export interface BaseFunctionClause {
  readonly name: string
  readonly pure: boolean
  readonly effect: boolean
  readonly description: string
  readonly group: FunctionGroup
  readonly args: Argument[]
  readonly chain: boolean
  readonly returns: ArgumentType
  readonly examples: Example[]
  readonly reference: (ctx: FormulaContext, ...args: any[]) => Result
}

export interface NormalFunctionClause extends BaseFunctionClause {
  readonly chain: false
}

export interface ChainFunctionClause extends BaseFunctionClause {
  readonly chain: true
  readonly args: [Argument, ...Argument[]]
  readonly reference: (ctx: FormulaContext, chainResult: any, ...args: any[]) => Result
}

export type FunctionClause = NormalFunctionClause | ChainFunctionClause

export interface CodeFragment {
  readonly code: string
  readonly name: string
  readonly error?: ErrorMessage
}

type uuid = string

export type namespaceId = uuid
export type variableId = uuid

export interface VariableDependency {
  readonly variableId: variableId
  readonly namespaceId: namespaceId
}

export interface BaseVariableValue {
  updatedAt: Date
  readonly success: boolean
  readonly value?: Result
  readonly display?: string
  readonly type?: ArgumentType
  readonly errorMessages?: ErrorMessage[]
}

export interface SuccessVariableValue extends BaseVariableValue {
  readonly success: true
  readonly display: string
  readonly value: Result
  readonly type: ArgumentType
}

export interface ErrorVariableValue extends BaseVariableValue {
  readonly success: false
  readonly errorMessages: [ErrorMessage, ...ErrorMessage[]]
}

export type VariableValue = SuccessVariableValue | ErrorVariableValue

export interface VariableData {
  name: string
  namespaceId: namespaceId
  variableId: variableId
  definition: string
  dirty: boolean
  view?: View
  kind: VariableKind
  variableValue: VariableValue
  cst: CstNode
  codeFragments?: CodeFragment[]
  variableDependencies: VariableDependency[]
  functionDependencies: FunctionClause[]
}
export interface Context {
  [key: `$${namespaceId}@${variableId}`]: Variable
}

export type ErrorType = 'type' | 'syntax' | 'runtime' | 'fatal' | 'deps' | 'circular_dependency'
export interface ErrorMessage {
  readonly message: string
  readonly type: ErrorType
}
