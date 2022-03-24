import { OperatorType } from '../operator'

export const expressionOperator: OperatorType = {
  name: 'concat',
  parentRuntimeCheckType: 'any',
  skipReturnEarlyCheck: true,
  lhsType: 'any',
  rhsType: 'any',
  interpret: (ctx, lhs, rhs, operator) => {
    if (rhs.type === 'Function' && lhs.type === 'Function') {
      return { type: 'Function', result: [...lhs.result, ...rhs.result] }
    }

    return rhs
  }
}
