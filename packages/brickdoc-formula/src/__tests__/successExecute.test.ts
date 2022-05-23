import { interpret, parse } from '../grammar'
import { makeContext, SUCCESS_TEST_CASE } from '../tests'

describe('successExecute', () => {
  let ctx: Awaited<ReturnType<typeof makeContext>>
  beforeAll(async () => {
    ctx = await makeContext({ pages: SUCCESS_TEST_CASE.pages })
  })
  it.each(SUCCESS_TEST_CASE.successTestCases)(
    '<SUCCESS> $group $label "$definition"',
    async ({ definition, result }) => {
      const newCtx = { ...ctx, meta: { ...ctx.meta, input: definition } }
      const parseResult = parse(newCtx)
      expect([parseResult.variableParseResult.valid, parseResult.success, parseResult.errorMessages]).toEqual([
        true,
        true,
        []
      ])

      const tempT = await interpret({ ctx: newCtx, parseResult })
      const value = await tempT.task.variableValue
      expect(value.result.result).toEqual(result)
    }
  )
})
