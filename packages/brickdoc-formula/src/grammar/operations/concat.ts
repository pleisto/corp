import { OperatorType } from '../operator'

export const concatOperator: OperatorType = {
  name: 'concat',
  parentRuntimeCheckType: 'string',
  lhsType: 'string',
  rhsType: 'string',
  interpret: async ({ lhs, rhs }) => {
    const lhsResult = lhs.result as string
    const rhsResult = rhs.result as string

    return { result: lhsResult.concat(rhsResult), type: 'string' }
  }
}
