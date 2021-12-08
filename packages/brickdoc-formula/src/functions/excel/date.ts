import { ContextInterface, BaseFunctionClause, DateResult } from '../..'

export const TODAY = (ctx: ContextInterface): DateResult => ({ result: new Date(), type: 'Date' })

export const EXCEL_DATE_CLAUSES: Array<BaseFunctionClause<'Date'>> = [
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
