import axios from 'axios'
import { BaseFunctionClause, ErrorResult, FunctionContext, RecordResult, StringResult } from '../types'

export const REQUEST_GET = async (
  ctx: FunctionContext,
  { result: url }: StringResult
): Promise<RecordResult | ErrorResult> => {
  if (!url) return { type: 'Error', result: 'URL is blank', errorKind: 'runtime' }
  const { data, status, headers } = await axios.get(url)
  return {
    type: 'Record',
    subType: 'any',
    result: {
      data: { type: 'string', result: data },
      status: { type: 'number', result: status },
      headers: {
        type: 'Record',
        subType: 'string',
        result: Object.entries(headers).reduce((acc, [k, v]) => ({ ...acc, [k]: { type: 'string', result: v } }), {})
      }
    }
  }
}

export const CORE_REQUEST_CLAUSES: Array<BaseFunctionClause<'Record'>> = [
  {
    name: 'REQUEST_GET',
    async: true,
    pure: false,
    lazy: false,
    acceptError: false,
    effect: false,
    examples: [{ input: '=REQUEST_GET(10)', output: { type: 'Record', subType: 'any', result: {} } }],
    description: 'request get',
    group: 'core',
    args: [
      {
        type: 'string',
        name: 'url'
      }
    ],
    testCases: [],
    returns: 'Record',
    chain: false,
    reference: REQUEST_GET
  }
]
