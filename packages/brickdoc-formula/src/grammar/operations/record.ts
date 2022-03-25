import { RecordResult } from '../../types'
import { OperatorType } from '../operator'
import { extractSubType } from '../util'

export const recordOperator: OperatorType = {
  name: 'record',
  parentRuntimeCheckType: 'Record',
  skipReturnEarlyCheck: true,
  dynamicLhs: () => ({ type: 'Record', subType: 'void', result: {} }),
  lhsType: 'any',
  rhsType: 'any',
  interpret: async ({ lhs, rhs }) => {
    const { result: lhsResult, type, subType } = lhs as RecordResult
    const {
      result: { key, value }
    } = rhs as RecordResult

    return { type, subType, result: { ...lhsResult, [key.result as string]: value } }
  },
  packageResult: ({ result: inputResult }) => {
    const result = inputResult as RecordResult['result']
    return { type: 'Record', subType: extractSubType(Object.values(result)), result }
  }
}
