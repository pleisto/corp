import { AnyTypeResult } from '../../types'
import { OperatorType } from '../operator'
import { extractSubType } from '../util'

export const arrayOperator: OperatorType = {
  name: 'array',
  parentRuntimeCheckType: 'Array',
  skipReturnEarlyCheck: true,
  lhsType: 'any',
  rhsType: 'any',
  interpret: async ({ lhs }) => lhs,
  packageResult: result => {
    const arrayArgs = (result as unknown as AnyTypeResult[]) ?? []
    return { type: 'Array', subType: extractSubType(arrayArgs), result: arrayArgs }
  }
}
