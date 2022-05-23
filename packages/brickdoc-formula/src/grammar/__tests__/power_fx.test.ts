import { parse, innerInterpret } from '../core'
import { makeContext, SpreadsheetInput } from '../../tests'

const namespaceId = '57622108-1337-4edd-833a-2557835bcfe0'
const spreadsheetId = '28e28190-63bd-4f70-aeca-26e72574c01a'

interface TestCase {
  input: string
  label: string
  error: string | undefined
  value: any
}

const SNAPSHOT_FLAG = '<SNAPSHOT>'

const spreadsheetToken = `#${namespaceId}."MySpreadsheet"`

const testCases: TestCase[] = [
  {
    label: 'CountIf ok',
    input: `=CountIf(${spreadsheetToken}, ${spreadsheetToken}."first" >= 3)`,
    error: 'Expected number but got Column',
    value: 2
  },
  {
    label: 'CountIf error1',
    input: `=CountIf(${spreadsheetToken}, >= 3)`,
    error: undefined,
    value: 'Column is missing'
  }
]

describe('Power Fx Functions', () => {
  let ctx: Awaited<ReturnType<typeof makeContext>>

  beforeAll(async () => {
    ctx = await makeContext({
      pages: [
        {
          pageName: 'Page1',
          pageId: namespaceId,
          spreadsheets: [
            <SpreadsheetInput<3, 3>>{
              name: 'MySpreadsheet',
              spreadsheetId,
              columns: [
                {
                  name: 'first',
                  displayIndex: 'A',
                  cells: [{ value: '1' }, { value: '3' }, { value: '5' }]
                },
                {
                  name: 'second',
                  displayIndex: 'B',
                  cells: [{ value: '2' }, { value: '4' }, { value: '6' }]
                },
                {
                  name: 'third',
                  displayIndex: 'C',
                  cells: [{ value: '3' }, { value: '' }, { value: 'Foo' }]
                }
              ]
            }
          ]
        }
      ]
    })
  })

  testCases.forEach(({ input, label, value, error }) => {
    it(`[${label}] ${input}`, async () => {
      const newCtx = { ...ctx, meta: { ...ctx.meta, input } }
      const parseResult = parse(newCtx)
      const {
        variableParseResult: { codeFragments },
        errorMessages
      } = parseResult
      expect(codeFragments).toMatchSnapshot()
      if (error) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(errorMessages[0]!.message).toEqual(error)
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(errorMessages).toEqual([])

        const result = (await innerInterpret({ parseResult, ctx: newCtx })).result.result
        if (value === SNAPSHOT_FLAG) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(result).toMatchSnapshot()
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(result).toEqual(value)
        }
      }
    })
  })
})
