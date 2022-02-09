import { FormulaContext, FormulaSourceType, quickInsert, VariableMetadata } from '@brickdoc/formula'
import { BrickdocEventBus, FormulaEditorUpdateEventTrigger } from '@brickdoc/schema'
import { renderHook, act } from '@testing-library/react-hooks'
import { JSONContent } from '@tiptap/core'
import { buildJSONContentByArray } from '../../../helpers'
import { useFormula } from '../useFormula'

const rootId = 'eb373fbc-a6e9-40a6-8c4b-45cda7230dda'
const formulaId = '2838c176-9a82-4e4f-a197-969d70c64694'
const updateFormula = () => {}
const normalFormulaType: FormulaSourceType = 'normal'
const formulaName = undefined
const formulaContext = new FormulaContext({})

const normalInput = {
  rootId,
  formulaId,
  updateFormula,
  formulaType: normalFormulaType,
  formulaName,
  formulaContext
}

const namespaceId = rootId
const variableIds = [
  'cd0755b8-0000-4326-876d-853e59cb0259',
  '88d64c7c-1111-4eea-be97-133e12c8c1ce',
  '94a89a9d-2222-4e46-ae48-887238bc2bec',
  'f78cb1af-3333-4d8b-8cd4-4e8a7da3a373',
  '74d1a0a2-4444-407b-a470-ac6ae1f3e8e2',
  'a17872fd-5555-4fe1-9cc9-57169a46b645',
  '396b8653-6666-4126-92b6-74006a435276'
]

const variableWithNames = variableIds.map((id, index) => ({ variableId: id, name: `num${index}` }))

const interpretContext = { ctx: {}, arguments: [] }

const asyncForEach = async (
  array: string | any[],
  callback: { (meta: VariableMetadata): Promise<void>; (arg0: any, arg1: number, arg2: any): any }
): Promise<void> => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const metas: VariableMetadata[] = [
  { name: 'num0', input: '=1' },
  { name: 'num1', input: '=2' },
  { name: 'num2', input: '=$num0' },
  { name: 'num3', input: '=$num2 + $num1' },
  { name: 'num4', input: '=$num2 + $num0' },
  { name: 'num5', input: '=$num3 + $num0 + $num2' },
  { name: 'num6', input: '=$num4 + $num1' }
].map(({ name, input }) => ({
  name,
  namespaceId,
  type: 'normal',
  variableId: variableWithNames.find(v => v.name === name)!.variableId,
  input: input.replace(/\$([a-zA-Z0-9_-]+)/g, (a, variableName): string => {
    return `#${namespaceId}.${variableWithNames.find(v => v.name === variableName)!.variableId}`
  })
}))

const SNAPSHOT_FLAG = '<SNAPSHOT>'

const testCases = [
  {
    title: 'constant 1',
    input: {
      position: 2,
      content: [
        {
          type: 'text',
          text: '12',
          marks: [
            {
              type: 'FormulaType',
              attrs: {
                code: 'NumberLiteral',
                errors: [],
                type: 'number',
                display: '12',
                value: '12'
              }
            }
          ]
        }
      ]
    },
    output: {
      position: 2,
      content: [
        {
          type: 'text',
          text: '12',
          marks: [
            {
              type: 'FormulaType',
              attrs: {
                attrs: undefined,
                code: 'NumberLiteral',
                errors: [],
                type: 'number',
                display: '12',
                value: '12',
                wrapQuote: false
              }
            }
          ]
        }
      ]
    }
  },
  {
    title: 'expression 1',
    input: {
      position: 3,
      content: [
        {
          type: 'text',
          text: 'num1'
        }
      ]
    },
    output: {
      position: 12,
      content: SNAPSHOT_FLAG
    }
  }
]

describe('useFormula', () => {
  beforeEach(async () => {
    formulaContext.resetFormula()

    await asyncForEach(metas, async (meta: VariableMetadata) => {
      await quickInsert({ ctx: { formulaContext, meta, interpretContext } })
    })
  })
  it('initial', () => {
    const { result } = renderHook(() => useFormula(normalInput))

    expect(result.current.variableT).toBe(undefined)
    expect(result.current.editorContent).toEqual({
      content: undefined,
      position: 0
    })
    expect(result.current.name).toBe(undefined)
    expect(result.current.defaultName).toBe('var1')
  })

  it.each(testCases)('$title', async ({ input, output }) => {
    const { result, waitForNextUpdate } = renderHook(() => useFormula(normalInput))

    const editorPosition = input.position
    const jsonContent = buildJSONContentByArray(input.content)

    act(() => {
      BrickdocEventBus.dispatch(
        FormulaEditorUpdateEventTrigger({ position: editorPosition, content: jsonContent, formulaId, rootId })
      )
    })

    await waitForNextUpdate()

    expect(result.current.editorContent.position).toEqual(output.position)
    if (output.content === SNAPSHOT_FLAG) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(result.current.editorContent.content).toMatchSnapshot()
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(result.current.editorContent.content).toEqual(buildJSONContentByArray(output.content as JSONContent[]))
    }
  })
})
