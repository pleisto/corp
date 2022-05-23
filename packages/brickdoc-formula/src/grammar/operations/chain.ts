import { OperatorType } from '../operator'
import { accessAttribute } from './access'

export const chainOperator: OperatorType = {
  name: 'chain',
  expressionType: 'any',
  lhsType: 'any',
  rhsType: 'any',
  dynamicInterpretRhsType: ({ result, cst, args }) => {
    if (cst.name === 'keyExpression') {
      return { ...args, type: 'any' }
    }

    if (cst.name === 'FunctionCall') {
      return { ...args, chainArgs: result }
    }

    return args
  },
  interpret: async ({ lhs, rhs, cst, interpreter }) => {
    if (cst.name === 'FunctionCall') {
      return rhs!
    }

    if (cst.name === 'keyExpression') {
      return await accessAttribute(interpreter, lhs, String(rhs!.result) as string)
    }

    throw new Error(`Unexpected cst type ${cst.name}`)
  },
  testCases: {
    successTestCases: [
      { definition: '={a:1}.a', result: 1 },
      { definition: '={a:1}.b', result: 'Key b not found' },
      { definition: '=[1,2,3].1', result: 1 },
      { definition: '=[123].b', result: 'Need a number: b' },
      { definition: '={a:1}."a"', result: 1 }
    ],
    errorTestCases: [
      { definition: '=1.a', errorType: 'syntax', errorMessage: 'Access error' },
      { definition: '=1."a"', errorType: 'syntax', errorMessage: 'Access error' },
      { definition: '=true.a', errorType: 'syntax', errorMessage: 'Access error' }
    ]
  }
}
