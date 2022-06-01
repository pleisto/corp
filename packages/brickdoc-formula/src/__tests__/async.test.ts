import { interpret, parse } from '../grammar/core'
import { makeContext } from '../tests/testHelper'
import { ALL_TEST_CASE } from '../tests'

const testCases = [
  ...ALL_TEST_CASE.successTestCases
    .filter(v => v.groupOptions.map(g => g.name).includes('async'))
    .map(args => ({ ...args, async: true })),
  { definition: '=12', result: 12, async: false }
]
describe('async', () => {
  let ctx: Awaited<ReturnType<typeof makeContext>>
  beforeAll(async () => {
    jest.useRealTimers()
    ctx = await makeContext(ALL_TEST_CASE.options)
    jest.clearAllTimers()
  })

  it.each(testCases)('<Async> $jestTitle', async args => {
    jest.useRealTimers()

    const newCtx = { ...ctx, meta: ctx.buildMeta(args) }
    const parseResult = parse(newCtx)
    expect(parseResult.variableParseResult.async).toBe(args.async)
    expect(parseResult.variableParseResult.valid).toBe(true)
    expect(parseResult.errorMessages).toEqual([])
    expect(parseResult.success).toBe(true)

    const tempT = await interpret({ ctx: newCtx, parseResult })
    expect(tempT.task.async).toBe(args.async)

    const value = await tempT.task.variableValue
    expect(value.result.result).toEqual(args.result)

    jest.clearAllTimers()
  })
})
