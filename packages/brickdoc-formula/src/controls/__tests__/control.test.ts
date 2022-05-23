/* eslint-disable max-len */
/* eslint-disable jest/no-conditional-expect */
import { innerInterpret, parse } from '../../grammar/core'
import { FORMULA_FEATURE_CONTROL } from '../../context'
import { makeContext } from '../../tests'

const namespaceId = '57622108-1337-4edd-833a-2557835bcfe0'
const variableId = '481b6dd1-e668-4477-9e47-cfe5cb1239d0'
const barVariableId = '28e28190-63bd-4f70-aeca-26e72574c01a'

const testName1 = 'varvarabcvar'

const SNAPSHOT_FLAG = '<SNAPSHOT>'
const pages = [
  {
    pageName: 'Page1',
    pageNamespaceId: namespaceId,
    variables: [
      { variableName: testName1, definition: '=24', variableNamespaceId: variableId },
      { variableName: 'bar', definition: `=#${namespaceId}.${testName1}`, variableNamespaceId: barVariableId }
    ]
  }
]

describe('Controls', () => {
  let ctx: Awaited<ReturnType<typeof makeContext>>

  beforeAll(async () => {
    ctx = await makeContext({ pages })
  })

  interface TestCase {
    input: string
    label: string
    parseErrorMessage: string | undefined
    result: any
  }

  const testCases: TestCase[] = [
    {
      label: 'set error',
      input: '= Set(a, 1)',
      parseErrorMessage: 'Unknown function a',
      result: null
    },
    // {
    //   label: 'set ok',
    //   input: `=Set(#${namespaceId}.${testName1}, 1)`,
    //   parseErrorMessage: undefined,
    //   result: SNAPSHOT_FLAG
    // },
    // {
    //   label: 'set ok 2',
    //   input: `=Set(#${namespaceId}.${testName1}, (1 + #${namespaceId}.${testName1} + #${namespaceId}.${testName1}))`,
    //   parseErrorMessage: undefined,
    //   result: SNAPSHOT_FLAG
    // },
    // {
    //   label: 'set multiple line',
    //   input: `=Set(#${namespaceId}.${testName1}, (1 + #${namespaceId}.${testName1})); Set(#${namespaceId}.${testName1}, (123))`,
    //   parseErrorMessage: undefined,
    //   result: SNAPSHOT_FLAG
    // },
    {
      label: 'set unknown',
      input: `=Set(#${namespaceId}.baz, 1)`,
      parseErrorMessage: `"baz" not found`,
      result: null
    },
    // {
    //   label: 'set expression TODO -> Only constant variable is supported',
    //   input: `=Set(#${namespaceId}.bar, 1)`,
    //   parseErrorMessage: undefined,
    //   result: SNAPSHOT_FLAG
    // },
    // {
    //   label: 'button',
    //   input: `=Button("Foo", Set(#${namespaceId}.${testName1}, (1 + #${namespaceId}.${testName1})))`,
    //   parseErrorMessage: undefined,
    //   result: SNAPSHOT_FLAG
    // },
    // {
    //   label: 'button multiple set',
    //   input: `=Button("Foo", Set(#${namespaceId}.${testName1}, (1 + #${namespaceId}.${testName1})); Set(#${namespaceId}.${testName1}, (123)))`,
    //   parseErrorMessage: undefined,
    //   result: SNAPSHOT_FLAG
    // },
    // {
    //   label: 'input ok',
    //   input: `=CInput(Set(#${namespaceId}.${testName1}, (1 + #${namespaceId}.${testName1})))`,
    //   parseErrorMessage: undefined,
    //   result: SNAPSHOT_FLAG
    // },
    // {
    //   label: 'switch set',
    //   input: `=Switch(true, Set(#${namespaceId}.${testName1}, (1 + #${namespaceId}.${testName1})); Set(#${namespaceId}.${testName1}, (123)))`,
    //   parseErrorMessage: undefined,
    //   result: SNAPSHOT_FLAG
    // },
    // {
    //   label: 'select ok',
    //   input: `=Select([1,2,3], Set(#${namespaceId}.${testName1}, Input.selected))`,
    //   parseErrorMessage: undefined,
    //   result: SNAPSHOT_FLAG
    // },
    {
      label: 'select []',
      input: `=Select([], Set(#${namespaceId}.${testName1}, Input.selected))`,
      parseErrorMessage: undefined,
      result: 'Select expects non empty options'
    },
    {
      label: 'select [[]]',
      input: `=Select([[]], Set(#${namespaceId}.${testName1}, Input.selected))`,
      parseErrorMessage: undefined,
      result: 'Select expects an array of strings'
    }
  ]

  it('feature', async () => {
    const noFeatureCtx = await makeContext({ initializeOptions: { domain: 'test', features: [] }, pages })
    const input = `=Button("Foo", Set(#${namespaceId}.${testName1}, (1 + #${namespaceId}.${testName1})))`
    const { errorMessages: errorMessage1 } = parse({ ...noFeatureCtx, meta: { ...noFeatureCtx.meta, input } })
    expect(errorMessage1).toEqual([{ message: 'Function Button not found', type: 'deps' }])

    const featureCtx = await makeContext({ initializeOptions: { domain: 'test' }, pages })
    featureCtx.formulaContext.features = []
    const { errorMessages: errorMessage2 } = parse({ ...featureCtx, meta: { ...featureCtx.meta, input } })
    expect(errorMessage2).toEqual([{ message: 'Feature formula-controls not enabled', type: 'deps' }])

    featureCtx.formulaContext.features = [FORMULA_FEATURE_CONTROL]
    const { errorMessages: errorMessage3 } = parse({ ...featureCtx, meta: { ...featureCtx.meta, input } })
    expect(errorMessage3).toEqual([])
  })

  testCases.forEach(({ input, label, parseErrorMessage, result }) => {
    it(`[${label}] ${input}`, async () => {
      const newCtx = { ...ctx, meta: { ...ctx.meta, input } }
      const parseResult = parse(newCtx)
      const {
        errorMessages,
        variableParseResult: { valid, codeFragments },
        success
      } = parseResult

      expect(valid).toBe(true)
      expect(codeFragments).toMatchSnapshot()
      expect(errorMessages[0]?.message).toEqual(parseErrorMessage)

      if (success) {
        const variableValue = await innerInterpret({ parseResult, ctx: newCtx })

        expect(variableValue.success).toBe(true)
        if (result === SNAPSHOT_FLAG) {
          const snapshot = variableValue.result

          if ((snapshot.result as any)._formulaContext) {
            expect({
              ...snapshot,
              result: { ...(snapshot.result as any), _formulaContext: '#HIDDEN#' }
            }).toMatchSnapshot()
          } else {
            expect(variableValue.result).toMatchSnapshot()
          }
        } else {
          expect(variableValue.result.result).toEqual(result)
        }
      }
    })
  })
})
