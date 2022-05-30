import { interpret, parse } from '../grammar/core'
import { makeContext } from '../tests/testHelper'
import { ASYNC_TEST_CASE } from '../tests'

describe('async', () => {
  const testCases = [
    ...ASYNC_TEST_CASE.successTestCases.map(({ definition, result }) => ({
      definition,
      output: result,
      async: true
    })),
    { definition: '=12', output: 12, async: false }
  ]
  let ctx: Awaited<ReturnType<typeof makeContext>>
  beforeAll(async () => {
    jest.useRealTimers()
    ctx = await makeContext({ pages: ASYNC_TEST_CASE.pages })
    jest.clearAllTimers()
  })

  it.each(testCases)('[async: $async] "$input"', async ({ definition, output, async }) => {
    jest.useRealTimers()

    const newCtx = { ...ctx, meta: ctx.meta({ definition }) }
    const parseResult = parse(newCtx)
    expect(parseResult.variableParseResult.async).toBe(async)
    expect(parseResult.variableParseResult.valid).toBe(true)
    expect(parseResult.errorMessages).toEqual([])
    expect(parseResult.success).toBe(true)

    const tempT = await interpret({ ctx: newCtx, parseResult })
    expect(tempT.task.async).toBe(async)

    const result = await tempT.task.variableValue
    expect(result.result.result).toEqual(output)

    jest.clearAllTimers()
  })
})
