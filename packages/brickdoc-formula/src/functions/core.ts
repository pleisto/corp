import { ContextInterface, BasicFunctionClause, ErrorResult, ReferenceResult, FunctionResult, CstResult } from '..'

export const Set = (
  ctx: ContextInterface,
  { result: name }: ReferenceResult,
  { result: body }: CstResult
): FunctionResult | ErrorResult => {
  // TODO check reference type
  return { type: 'Function', result: { name: '123', args: [] } }
}

export const CORE_CORE_CLAUSES: Array<BasicFunctionClause<any>> = [
  {
    name: 'Set',
    async: false,
    pure: false,
    lazy: true,
    acceptError: false,
    effect: false,
    examples: [{ input: '=Set(A, A+1)', output: null }],
    description: 'Set variable',
    group: 'core',
    args: [
      {
        name: 'name',
        type: 'Reference'
      },
      {
        name: 'body',
        type: 'any'
      }
    ],
    testCases: [],
    returns: 'Function',
    chain: false,
    reference: Set
  }
]
