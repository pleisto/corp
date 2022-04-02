import { ErrorMessage } from '../../types'
import { OperatorType } from '../operator'

const unavailableMessage: ErrorMessage = {
  message: 'thisRow is only available in spreadsheet',
  type: 'syntax'
}

export const thisRowOperator: OperatorType = {
  name: 'thisRow',
  expressionType: 'Row',
  dynamicParseType: lhsType => lhsType,
  lhsType: 'any',
  rhsType: 'any',
  dynamicInterpretLhs: (args, operators, interpreter) => {
    if (interpreter.ctx.meta.richType.type !== 'spreadsheet') {
      return { type: 'Error', result: unavailableMessage.message, errorKind: 'runtime' }
    }

    return { type: 'string', result: `Block this row not found` }
  },
  dynamicParseValidator: (cstVisitor, { image, codeFragments, type }) => {
    const errorMessages: ErrorMessage[] = []

    if (cstVisitor.ctx.meta.richType.type !== 'spreadsheet') {
      errorMessages.push(unavailableMessage)
    }

    return { image, codeFragments: codeFragments.map(c => ({ ...c, errors: [...errorMessages, ...c.errors] })), type }
  },
  interpret: async ({ lhs }) => lhs
}
