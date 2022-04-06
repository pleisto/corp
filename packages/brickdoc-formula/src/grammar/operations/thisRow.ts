import { SpreadsheetReloadViaId } from '@brickdoc/schema'
import { ErrorMessage, EventDependency } from '../../types'
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

    const {
      richType: {
        meta: { spreadsheetId, rowId }
      }
    } = interpreter.ctx.meta

    const row = interpreter.ctx.formulaContext.findRowById(spreadsheetId, rowId)
    if (!row) return { type: 'Error', result: `Row ${rowId} not found`, errorKind: 'runtime' }

    return { type: 'Row', result: row }
  },
  dynamicParseValidator: (cstVisitor, { image, codeFragments, type }) => {
    if (cstVisitor.ctx.meta.richType.type !== 'spreadsheet') {
      return {
        image,
        codeFragments: codeFragments.map(c => ({ ...c, errors: [unavailableMessage, ...c.errors] })),
        type
      }
    }

    const {
      richType: {
        meta: { spreadsheetId, rowId }
      },
      namespaceId
    } = cstVisitor.ctx.meta

    const rowDependencyEvent: EventDependency = {
      kind: 'Row',
      event: SpreadsheetReloadViaId,
      eventId: `${namespaceId},${spreadsheetId}`,
      scopes: [{ kind: 'Row', keys: [rowId] }]
    }

    cstVisitor.eventDependencies.push(rowDependencyEvent)

    const errorMessages: ErrorMessage[] = []
    return { image, codeFragments: codeFragments.map(c => ({ ...c, errors: [...errorMessages, ...c.errors] })), type }
  },
  interpret: async ({ lhs }) => lhs
}
