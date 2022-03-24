import { OperatorType } from '../operator'

export const concatOperator: OperatorType = {
  name: 'concat',
  parentRuntimeCheckType: 'string',
  lhsType: 'string',
  rhsType: 'string',
  interpret: (ctx, lhs, rhs, operator) => {
    const lhsResult = lhs.result as string
    const rhsResult = rhs.result as string

    return { result: lhsResult.concat(rhsResult), type: 'string' }
  }
}
