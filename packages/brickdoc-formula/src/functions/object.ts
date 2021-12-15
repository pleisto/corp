import { ContextInterface, StringResult, ObjectResult, BasicFunctionClause, AnyTypeResult } from '..'

export const T = (ctx: ContextInterface, obj: AnyTypeResult): AnyTypeResult => obj

export const TYPE = (ctx: ContextInterface, obj: AnyTypeResult): StringResult => ({ result: obj.type, type: 'string' })

export const WITH_TYPE = (ctx: ContextInterface, obj: AnyTypeResult): ObjectResult => ({
  result: obj,
  type: 'Object'
})

// TODO validate any type
export const CORE_OBJECT_CLAUSES: Array<BasicFunctionClause<any>> = [
  {
    name: 'T',
    async: false,
    pure: true,
    acceptError: true,
    effect: false,
    description: 'Returns current object',
    group: 'core',
    args: [
      {
        name: 'obj',
        type: 'any'
      }
    ],
    returns: 'any',
    testCases: [],
    examples: [
      { input: '=T(100)', output: { type: 'number', result: 100 } },
      { input: '=T("foo")', output: { type: 'string', result: 'foo' } }
    ],
    chain: true,
    reference: T
  },
  {
    name: 'TYPE',
    async: false,
    pure: true,
    acceptError: true,
    effect: false,
    description: 'Returns type of current object',
    group: 'core',
    args: [
      {
        name: 'obj',
        type: 'any'
      }
    ],
    returns: 'string',
    testCases: [],
    examples: [
      { input: '=TYPE(100)', output: { type: 'string', result: 'number' } },
      { input: '=TYPE("foo")', output: { type: 'string', result: 'string' } }
    ],
    chain: true,
    reference: TYPE
  },
  {
    name: 'WITH_TYPE',
    async: false,
    pure: true,
    acceptError: true,
    effect: false,
    description: 'Returns object with type',
    group: 'core',
    args: [
      {
        name: 'obj',
        type: 'any'
      }
    ],
    examples: [
      { input: '=WITH_TYPE(100)', output: { type: 'Object', result: 'TODO ...' } },
      { input: '=WITH_TYPE("foo")', output: { type: 'Object', result: 'TODO ...' } }
    ],
    returns: 'Object',
    testCases: [],
    chain: true,
    reference: WITH_TYPE
  }
]
