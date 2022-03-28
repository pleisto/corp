import { OperatorType } from '../operator'

export const parenthesisOperator: OperatorType = {
  name: 'parenthesis',
  parentRuntimeCheckType: 'any',
  dynamicParseType: lhsType => lhsType,
  lhsType: 'any',
  rhsType: 'any',
  interpret: async ({ lhs }) => lhs
}
