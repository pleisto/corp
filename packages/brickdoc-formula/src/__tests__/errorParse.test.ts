import { parse } from '../grammar'
import { makeContext, ERROR_TEST_CASE } from '../tests'

describe('errorParse', () => {
  let ctx: Awaited<ReturnType<typeof makeContext>>
  beforeAll(async () => {
    ctx = await makeContext({ pages: ERROR_TEST_CASE.pages })
  })
  it.each(ERROR_TEST_CASE.errorTestCases)(
    '<ERROR> $group $label "$definition" -> [$errorType] "$errorMessage"',
    async ({ definition, errorMessage, errorType, valid }) => {
      const newCtx = { ...ctx, meta: { ...ctx.meta, input: definition } }
      const parseResult = parse(newCtx)
      expect(parseResult.success).toBe(false)
      expect([parseResult.errorMessages[0], parseResult.variableParseResult.valid]).toEqual([
        { type: errorType, message: errorMessage },
        valid ?? true
      ])
    }
  )
})
