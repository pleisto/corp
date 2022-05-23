import { parse } from '../grammar'
import { makeContext } from '../tests/testHelper'

const validInputs: string[] = [
  '1',
  'a',
  '1+123',
  '-1.%',
  '01.2000100',
  'hel"lo',
  'he中文"',
  '中文"123asd',
  '1:',
  '1:1',
  '1.%',
  '1.123%',
  '"123":1',
  ' 1  +  1 +  ',
  '(',
  ')',
  '()',
  '[',
  ']',
  '[]',
  '{',
  '}',
  '{}',
  ')=',
  '>=',
  '<',
  '<>',
  'ABS(1 {a: 1}.a',
  '(1 {}.',
  '='
]

describe('parser', () => {
  let ctx: Awaited<ReturnType<typeof makeContext>>
  beforeAll(async () => {
    ctx = await makeContext({
      pages: [
        {
          pageName: 'Simple',
          variables: [
            { variableName: 'num0', definition: '=1' },
            { variableName: 'num1', definition: '=2' },
            { variableName: 'num2', definition: '=num0' },
            { variableName: 'num3', definition: '=num2 + num1' },
            { variableName: 'num4', definition: '=num2 + num0' },
            { variableName: 'num5', definition: '=num3 + num0 + num2' },
            { variableName: 'num6', definition: '=num4 + num1' }
          ]
        },
        {
          pageName: 'Complex',
          variables: [
            {
              definition: '=123123',
              variableName: 'foo'
            }
          ]
        }
      ]
    })
  })
  it.each(validInputs)('valid: "=%s"', i => {
    const input = `=${i}`
    const {
      variableParseResult: { definition: newInput, codeFragments }
    } = parse({ ...ctx, meta: { ...ctx.meta, input } })
    expect(codeFragments.map(c => c.display).join('')).toEqual(newInput)
  })
})
