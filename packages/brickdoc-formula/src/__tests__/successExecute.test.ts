import { interpret, parse } from '../grammar'
import { makeContext, ALL_TEST_CASE } from '../tests'
import { matchObject } from '../tests/testMock'

describe('successExecute', () => {
  let ctx: Awaited<ReturnType<typeof makeContext>>
  beforeAll(async () => {
    jest.useRealTimers()
    ctx = await makeContext(ALL_TEST_CASE.options)
    jest.clearAllTimers()
  })
  it.each(ALL_TEST_CASE.successTestCases)('<SUCCESS> $group $label "$definition"', async args => {
    jest.useRealTimers()
    const newCtx = { ...ctx, meta: ctx.meta(args) }
    const parseResult = parse(newCtx)
    expect([parseResult.variableParseResult.valid, parseResult.success, parseResult.errorMessages]).toStrictEqual([
      true,
      true,
      []
    ])

    const tempT = await interpret({ ctx: newCtx, parseResult })
    const value = await tempT.task.variableValue
    expect(matchObject(value.result.result)).toStrictEqual(args.result)

    for (const { key, match, matchType } of args.expected ?? []) {
      switch (matchType) {
        case undefined:
        case 'toStrictEqual':
          // eslint-disable-next-line jest/no-conditional-expect
          expect([key, parseResult.variableParseResult[key]]).toStrictEqual([key, match])
          break
        case 'toMatchObject':
          // eslint-disable-next-line jest/no-conditional-expect
          expect([key, parseResult.variableParseResult[key]]).toMatchObject([key, match])
          break
        case 'toMatchSnapshot':
          // eslint-disable-next-line jest/no-conditional-expect
          expect([key, parseResult.variableParseResult[key]]).toMatchSnapshot()
          break
      }
    }

    jest.clearAllTimers()
  })
})
