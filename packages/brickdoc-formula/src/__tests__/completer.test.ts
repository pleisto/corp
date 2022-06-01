import { parse } from '../grammar/core'
import { makeContext } from '../tests/testHelper'
import { ALL_TEST_CASE } from '../tests'

const testCases = [...ALL_TEST_CASE.successTestCases, ...ALL_TEST_CASE.errorTestCases].filter(v =>
  v.groupOptions.map(g => g.name).includes('complete')
)

describe('completer', () => {
  let ctx: Awaited<ReturnType<typeof makeContext>>
  beforeAll(async () => {
    jest.useRealTimers()
    ctx = await makeContext(ALL_TEST_CASE.options)
    jest.clearAllTimers()
  })

  it.each(testCases)('<Completer> $jestTitle', async args => {
    jest.useRealTimers()

    const newCtx = { ...ctx, meta: ctx.buildMeta(args) }
    const parseResult = parse(newCtx)
    expect(parseResult.completions.length).not.toBe(0)
    const groupOption = args.groupOptions.find(g => g.name === 'complete')!.options
    // console.log(parseResult.completions[0])
    expect(parseResult.completions[0]).toMatchObject(groupOption)

    jest.clearAllTimers()
  })
})
