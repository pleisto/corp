import { AnyTypeResult, ArrayResult, BasicFunctionClause, ErrorResult, FunctionContext, StringResult } from '..'

export const Join = (
  ctx: FunctionContext,
  { subType, result }: ArrayResult,
  { result: separator }: StringResult
): StringResult | ErrorResult => {
  if (!['string', 'number', 'void'].includes(subType)) {
    return { type: 'Error', result: 'Join expects an array of strings', errorKind: 'runtime' }
  }

  return { result: result.map(a => a.result).join(separator), type: 'string' }
}

export const Map = (
  ctx: FunctionContext,
  { subType, result: array }: ArrayResult,
  { type, result }: AnyTypeResult
): ArrayResult | ErrorResult => {
  if (type !== 'Function') {
    return { type: 'Array', subType: type, result: array.map(a => result) }
  }

  const finalClause = result[result.length - 1]
  if (finalClause.name !== 'Lambda') {
    return { type: 'Error', result: 'Map expects a function', errorKind: 'runtime' }
  }

  // TODO: map body
  return { type: 'Array', result: array, subType }
}

export const CORE_ARRAY_CLAUSES: Array<BasicFunctionClause<'string' | 'Array'>> = [
  {
    name: 'Join',
    async: false,
    lazy: false,
    acceptError: false,
    pure: true,
    effect: false,
    description: 'Joins an array of strings',
    group: 'core',
    args: [
      {
        name: 'array',
        type: 'Array'
      },
      {
        name: 'separator',
        type: 'string',
        default: { type: 'string', result: ',' }
      }
    ],
    examples: [{ input: '=Join([1,2,3])', output: { type: 'string', result: '1,2,3' } }],
    returns: 'string',
    testCases: [],
    chain: true,
    reference: Join
  },
  {
    name: 'Map',
    async: false,
    lazy: false,
    acceptError: false,
    pure: true,
    effect: false,
    description: 'Maps an array of values',
    group: 'core',
    args: [
      {
        name: 'array',
        type: 'Array'
      },
      {
        name: 'value',
        type: 'any'
      }
    ],
    examples: [
      {
        input: '=Map([1,2], "hello")',
        output: {
          type: 'Array',
          subType: 'string',
          result: [
            { type: 'string', result: 'hello' },
            { type: 'string', result: 'hello' }
          ]
        }
      }
    ],
    returns: 'Array',
    testCases: [],
    chain: true,
    reference: Map
  }
]
