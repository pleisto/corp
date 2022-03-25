import { OperatorType } from '../operator'

export const parenthesisOperator: OperatorType = {
  name: 'parenthesis',
  parentRuntimeCheckType: 'any',
  lhsType: 'any',
  rhsType: 'any',
  interpret: async ({ lhs }) => lhs
}
