import { FunctionClause, FunctionCompletion, FunctionGroup, FunctionKey, FunctionName } from '..'
import { CORE_CLAUSES } from './core'
import { DATABASE_CLAUSES } from './database'
import { EXCEL_CLAUSES } from './excel'
import { THIRD_CLAUSES } from './third'

export const functionKey = (group: FunctionGroup, name: FunctionName): FunctionKey => `${group}::${name}`

export const BUILTIN_CLAUSES: Array<FunctionClause<any>> = [...EXCEL_CLAUSES, ...CORE_CLAUSES, ...DATABASE_CLAUSES, ...THIRD_CLAUSES].map(
  f => ({
    ...f,
    key: functionKey(f.group, f.name)
  })
)

export const function2completion = (functionClause: FunctionClause<any>, weight: number): FunctionCompletion => {
  return {
    kind: 'function',
    weight,
    name: functionClause.name,
    namespace: functionClause.group,
    value: functionClause.key,
    preview: functionClause
  }
}
