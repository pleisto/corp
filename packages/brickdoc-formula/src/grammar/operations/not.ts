import { OperatorType } from '../operator'

export const notOperator: OperatorType = {
  name: 'not',
  parentRuntimeCheckType: 'boolean',
  lhsType: 'any',
  rhsType: 'any',
  interpret: (ctx, lhs, rhs, operator) => {
    return { type: 'boolean', result: !lhs.result }
  }
}
