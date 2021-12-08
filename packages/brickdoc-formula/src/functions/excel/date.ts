import { ContextInterface, BaseFunctionClause } from '../..'

export const TODAY = (ctx: ContextInterface): Date => new Date()

export const EXCEL_DATE_CLAUSES: BaseFunctionClause[] = [
  {
    name: 'TODAY',
    async: false,
    pure: false,
    effect: false,
    description: 'Returns the current date',
    group: 'excel',
    args: [],
    examples: [],
    returns: 'Date',
    chain: false,
    reference: TODAY
  }
]
