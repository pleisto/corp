import {
  FunctionContext,
  BasicFunctionClause,
  ErrorResult,
  ButtonResult,
  StringResult,
  FunctionResult,
  SwitchResult,
  BooleanResult
} from '..'
import { ButtonClass } from '../controls/button'
import { SwitchClass } from '../controls/switch'

export const Button = (
  ctx: FunctionContext,
  { result: name }: StringResult,
  fn: FunctionResult
): ButtonResult | ErrorResult => {
  const buttonResult = new ButtonClass(ctx, { name, fn })
  return { result: buttonResult, type: 'Button' }
}

export const Switch = (
  ctx: FunctionContext,
  { result: isSelected }: BooleanResult,
  fn: FunctionResult
): SwitchResult | ErrorResult => {
  const switchResult = new SwitchClass(ctx, { isSelected, fn })
  return { result: switchResult, type: 'Switch' }
}

export const CORE_CONTROL_CLAUSES: Array<BasicFunctionClause<any>> = [
  {
    name: 'Button',
    async: false,
    pure: false,
    lazy: false,
    acceptError: false,
    effect: false,
    examples: [{ input: '=Button("name")', output: null }],
    description: 'Build button',
    group: 'core',
    args: [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'onClick',
        type: 'Function'
      }
    ],
    testCases: [],
    returns: 'Button',
    chain: false,
    reference: Button
  },
  {
    name: 'Switch',
    async: false,
    pure: false,
    lazy: false,
    acceptError: false,
    effect: false,
    examples: [{ input: '=Switch("name")', output: null }],
    description: 'Build switch',
    group: 'core',
    args: [
      {
        name: 'name',
        type: 'boolean'
      },
      {
        name: 'onClick',
        type: 'Function'
      }
    ],
    testCases: [],
    returns: 'Switch',
    chain: false,
    reference: Switch
  }
]
