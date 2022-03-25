import { OperatorType } from '../operator'

export const notOperator: OperatorType = {
  name: 'not',
  parentRuntimeCheckType: 'boolean',
  skipRhsCstParse: true,
  reverseLhsAndRhs: true,
  lhsType: 'any',
  rhsType: 'any',
  interpret: async ({ lhs }) => {
    return { type: 'boolean', result: !lhs.result }
  }
}
