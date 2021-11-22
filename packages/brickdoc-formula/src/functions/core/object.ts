import { FormulaContext, FunctionClause } from '../..'

export const T = (ctx: FormulaContext, obj: any): any => obj

export const TYPE = (ctx: FormulaContext, obj: any): string => typeof obj

export const WITH_TYPE = (ctx: FormulaContext, obj: any): { type: string; obj: any } => ({
  type: typeof obj,
  obj
})

export const OBJECT_CLAUSES: FunctionClause[] = [
  {
    name: 'T',
    pure: true,
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
    examples: [
      { input: [1], output: 1 },
      { input: ['foo'], output: 'foo' }
    ],
    chain: true,
    reference: T
  },
  {
    name: 'TYPE',
    pure: true,
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
    examples: [
      { input: [1], output: 'number' },
      { input: ['foo'], output: 'string' }
    ],
    chain: true,
    reference: TYPE
  },
  {
    name: 'WITH_TYPE',
    pure: true,
    effect: false,
    description: 'Returns object with type',
    group: 'core',
    args: [
      {
        name: 'obj',
        type: 'any'
      }
    ],
    returns: 'object',
    examples: [
      { input: [1], output: { type: 'number', obj: 1 } },
      { input: ['foo'], output: { type: 'string', obj: 'foo' } }
    ],
    chain: true,
    reference: WITH_TYPE
  }
]
