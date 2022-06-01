import { parse } from '../grammar'
import { ALL_TEST_CASE } from '../tests'
import { makeContext } from '../tests/testHelper'

const validInputs: string[] = [
  '=a',
  '=-1.%',
  '=01.2000100',
  '=hel"lo',
  '=he中文"',
  '=中文"123asd',
  '=1:',
  '=1:1',
  '=1.%',
  '=1.123%',
  '="123":1',
  '=)=',
  '=>=',
  '=<',
  '=<>',
  '=ABS(1 {a: 1}.a',
  '=(1 {}.',
  '==',
  ...ALL_TEST_CASE.successTestCases.map(({ definition }) => definition),
  ...ALL_TEST_CASE.errorTestCases.map(({ definition }) => definition)
]

describe('parser', () => {
  let ctx: Awaited<ReturnType<typeof makeContext>>
  beforeAll(async () => {
    jest.useRealTimers()
    ctx = await makeContext(ALL_TEST_CASE.options)
    jest.clearAllTimers()
  })
  it.each(validInputs)('valid: "=%s"', input => {
    const {
      variableParseResult: { definition: newInput, codeFragments }
    } = parse({ ...ctx, meta: ctx.buildMeta({ definition: input }) })
    expect(codeFragments.map(c => c.display).join('')).toEqual(newInput)
  })
})
