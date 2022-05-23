import { parse } from '../core'
import { makeContext } from '../../tests/testHelper'

const namespaceId = '57622108-1337-4edd-833a-2557835bcfe0'
const unknownId = 'cd4f6e1e-765e-4064-badd-b5585c7eff8e'

const testCases = [
  '= (1 + 1) / 2 * 0.1 == (!!true and false or true) == "123"',
  '= custom::PLUS((custom::FORTY_TWO()), 1 + 1)',
  '= ABS("123")',
  '="FOO".T().T() & "Zzz"',
  `=#${namespaceId}.foo + 1`,
  `=#${unknownId}.foo + 2`,
  `=#${namespaceId}."bar" + 3`,
  `=foo + 1`,
  `=#${namespaceId}.foo + 1`,
  `=Untitled.foo + 1`,
  `=Bar.foo + 2`,
  `=Untitled.bar + 3`
]

describe('Code fragment ok', () => {
  let ctx: Awaited<ReturnType<typeof makeContext>>

  beforeAll(async () => {
    ctx = await makeContext({
      pages: [
        {
          pageName: 'CodeFragment',
          pageId: namespaceId,
          variables: [{ variableName: 'foo', definition: '=24' }]
        }
      ]
    })
  })

  testCases.forEach(input => {
    // eslint-disable-next-line jest/valid-title
    it(input, () => {
      const {
        variableParseResult: { codeFragments, cst }
      } = parse({ ...ctx, meta: { ...ctx.meta, input } })
      // expect(success).toBe(true)
      expect(cst).toMatchSnapshot()
      expect(codeFragments).toMatchSnapshot()
    })
  })
})
