/* eslint-disable jest/no-conditional-expect */
import { parse, innerInterpret } from '../core'
import { ParseErrorType } from '../../types'
import { displayValue } from '../../context/persist'
import { makeContext } from '../../tests/testHelper'

interface TestCase {
  input: string
  value?: any
  label?: string
  display?: string
  parseErrorType?: ParseErrorType
  errorMessage?: string
  debug?: true
}

const namespaceId = '57622108-1337-4edd-833a-2557835bcfe0'
const barNamespaceId = 'cd4f6e1e-765e-4064-badd-b5585c7eff8e'
const barVariableId = '481b6dd1-e668-4477-9e47-cfe5cb1239d0'
const bazVariableId = 'c53c6bf7-c79f-40ce-be2c-da916f1cdb5f'

const testCases: TestCase[] = [
  {
    input: '=null',
    value: null
  },
  {
    input: '= -0.123%',
    label: 'caret and sign',
    value: -0.00123
  },
  {
    input: '=123123123123123123123',
    label: 'js precision',
    value: 123123123123123130000
  },
  // Array
  {
    input: '=[2, "foo", true].2',
    label: 'Array access 1',
    value: 'foo'
  },
  {
    input: '=[2, "foo", true][2]',
    label: 'Array access [] 1',
    value: 'foo'
  },
  {
    input: '=[2, "foo", true][1]+1 * 12',
    label: 'access and add',
    value: 14
  },
  {
    input: '=[2, "foo", true].4',
    label: 'Array access 2',
    value: 'Index 4 out of bounds'
  },
  {
    input: '=[2, "foo", true].foo',
    label: 'Array access 3',
    value: 'Need a number: foo'
  },
  // {
  //   input: '=[2, "foo", true, null].Map(1)',
  //   label: 'Array Map',
  //   value: [
  //     { type: 'number', result: 1 },
  //     { type: 'number', result: 1 },
  //     { type: 'number', result: 1 },
  //     { type: 'number', result: 1 }
  //   ]
  // },
  // {
  //   input: '=[2, "foo", true, null].Map($1)',
  //   label: 'Array Map $1',
  //   value: [
  //     { type: 'number', result: 2 },
  //     { type: 'string', result: 'foo' },
  //     { type: 'boolean', result: true },
  //     { type: 'null', result: null }
  //   ]
  // },
  // Reference
  {
    input: `=Self`,
    value: { kind: 'self' }
  },
  {
    input: `=#${barNamespaceId}.bar`,
    value: 24
  },
  {
    input: `=#`,
    parseErrorType: 'syntax',
    errorMessage: 'Miss expression'
  },
  {
    input: `=#CurrentBlock`,
    value: 'SNAPSHOT',
    display: 'Page1'
  },
  {
    input: `=#CurrentBlock.baz`,
    value: 25
  },
  {
    input: `=baz`,
    value: 25
  },
  {
    input: `="baz"`,
    value: 25
  },
  {
    input: `=#${barNamespaceId}.Bar`,
    label: 'variable name is case insensitive',
    value: 24
  },
  {
    input: `=bar`,
    parseErrorType: 'syntax',
    errorMessage: 'Unknown function bar'
  },
  {
    input: `=Untitled.bar`,
    value: 24
  },
  {
    input: `=&#${barNamespaceId}.bar`,
    // value: { kind: 'variable', namespaceId: barNamespaceId, variableId: barVariableId }
    parseErrorType: 'syntax',
    errorMessage: 'Parse error: "#"'
  },
  {
    input: `=&#${barNamespaceId}.bar.foo`,
    // value: { kind: 'variable', namespaceId: barNamespaceId, variableId: barVariableId, attribute: 'foo' }
    parseErrorType: 'syntax',
    errorMessage: 'Parse error: "#"'
  },
  {
    input: '=&Self',
    value: { kind: 'self' }
  },
  {
    input: '=&Self."foo bar"',
    value: { kind: 'self', attribute: 'foo bar' }
  },
  // Record
  {
    input: '={a: 1}[a]',
    parseErrorType: 'syntax',
    errorMessage: 'Unknown function a'
  },
  {
    input: '={a: 1}.a+1',
    value: 2
  },
  {
    input: '={a: 1}[1]',
    value: 'Key 1 not found'
  },
  {
    input: '={a: 1}[1+1]',
    value: 'Key 2 not found'
  },
  {
    input: '={a: 1}["a"]',
    value: 1
  },
  {
    input: '={a: 1}["a" & ""]',
    value: 1
  },
  // Number Literal
  {
    input: '=123123',
    value: 123123
  },
  {
    input: '=0',
    value: 0
  },
  {
    input: '=0.01',
    value: 0.01
  },
  {
    input: '=-1.',
    parseErrorType: 'syntax',
    errorMessage: 'Missing expression'
  },
  {
    input: '=01',
    value: 1
  },
  {
    input: '=0001.0000',
    value: 1
  },
  {
    input: '=1.%',
    parseErrorType: 'syntax',
    errorMessage: 'Missing expression'
  },
  {
    input: '=12.0',
    value: 12
  },
  {
    input: '=-0',
    value: -0
  },
  {
    input: '=-101',
    value: -101
  },
  // Boolean Literal
  {
    input: '=true',
    value: true
  },
  {
    input: '=false',
    value: false
  },
  // String Literal
  {
    input: '= "hello"',
    value: 'hello'
  },
  {
    input: '= "hel\'lo"',
    value: "hel'lo"
  },
  {
    input: '= "hel"lo"',
    label: 'lex error when parse "hel"lo" => parseError',
    parseErrorType: 'syntax',
    errorMessage: 'Not all input parsed: lo'
  },
  {
    input: "= 'hello'",
    label: 'Single quote => parseError',
    parseErrorType: 'syntax',
    errorMessage: 'Parse error:'
  },
  {
    input: '= "Hello',
    label: 'ParseError without closing quote',
    parseErrorType: 'syntax',
    errorMessage: 'Parse error: "\\"Hello"'
  },
  // %
  {
    input: '= 2%',
    value: 0.02
  },
  {
    input: '=5100%',
    value: 51
  },
  // Combine
  {
    input: '=Input.foo',
    value: 'Key foo not found'
  },
  {
    input: '=Input.bar',
    value: 'bar123'
  },
  {
    input: '=$1',
    value: 'Foo1234123'
  },
  {
    input: '=$2',
    value: 'Argument 2 not found'
  },
  // Error
  {
    input: '= ABS(1/0)',
    value: 'Division by zero'
  },
  {
    input: '= IFERROR(1/0, "Foo")',
    value: 'Foo'
  },
  {
    input: '=ABS(',
    parseErrorType: 'syntax',
    label: 'Missing closing parenthesis2',
    errorMessage: 'Miss argument'
  },
  {
    input: '=ABS(1',
    parseErrorType: 'syntax',
    label: 'Missing closing parenthesis3',
    errorMessage: 'Missing closing parenthesis'
  },
  {
    input: '=POWER(1,',
    parseErrorType: 'syntax',
    label: 'Missing closing parenthesis4',
    errorMessage: 'Missing closing parenthesis'
  },
  {
    input: '=POWER(1,2',
    parseErrorType: 'syntax',
    label: 'Missing closing parenthesis5',
    errorMessage: 'Missing closing parenthesis'
  },
  // Function Call
  {
    input: '=ABS ( -1  )',
    value: 1
  },
  {
    input: '=core::ABS ( -1  )',
    value: 1
  },
  {
    input: '=custom::ADD (  -1,  1  )',
    label: 'function with group',
    value: 0
  },
  {
    input: '=ABS ()',
    parseErrorType: 'syntax',
    errorMessage: 'Miss argument'
  },
  {
    input: '=ABS(1,2)',
    parseErrorType: 'syntax',
    errorMessage: 'Argument count mismatch'
  },
  {
    input: '=AVERAGE()',
    parseErrorType: 'syntax',
    errorMessage: 'Miss argument',
    label: 'Spread operator with no argument'
  },
  {
    input: '=AVERAGE(1)',
    value: 1,
    label: 'spread operator'
  },
  {
    input: '=AVERAGE(1, 2, 3)',
    value: 2,
    label: 'spread operator'
  },
  {
    input: '=IF(true, 1+2, "2")',
    value: 3
  },
  {
    input: '=ABS(IF(false, -3, -4))',
    value: 4
  },
  {
    input: '=toString(1)',
    value: '1'
  },
  {
    input: '=toString("Foo")',
    value: '"Foo"'
  },
  {
    input: '=UNKNOWN ()',
    parseErrorType: 'syntax',
    errorMessage: 'Function UNKNOWN not found'
  },
  {
    input: '=DATE("")',
    value: new Date(NaN),
    display: 'Invalid Date'
  },
  {
    input: '=DATE("22/2/2022")',
    value: new Date(NaN),
    display: 'Invalid Date'
  },
  {
    input: '=DATE("2022-2-22")',
    value: new Date('2022-2-22'),
    display: new Date('2022-2-22').toISOString()
  },
  // Case insensitive
  {
    input: '=if(true, 1+2, "2")',
    label: 'Case insensitive',
    value: 3
  },
  {
    input: '=Abs(-1) + abs(1) + ABS(1)',
    value: 3
  },
  // Chain
  {
    input: '="FOO".',
    parseErrorType: 'syntax',
    errorMessage: 'Missing expression'
  },
  {
    input: '="FOO".T',
    parseErrorType: 'syntax',
    errorMessage: 'Access error'
  },
  {
    input: '="FOO".T().T()',
    value: 'FOO'
  },
  {
    input: '=(1+1).TYPE()',
    value: 'number'
  },
  {
    input: '=[1,false,"foo"].toString()',
    value: '[1, false, "foo"]'
  },
  {
    input: '="foobar".START_WITH("foo")',
    value: true
  },
  {
    input: '="foobar".START_WITH("bar")',
    value: false
  },
  {
    input: '="foo".START_WITH(123)',
    parseErrorType: 'syntax',
    errorMessage: 'Expected string but got number',
    label: 'chain type 1'
  },
  {
    input: '=true.START_WITH("123")',
    parseErrorType: 'syntax',
    label: 'TODO chain type 2',
    errorMessage: 'Expected string but got boolean'
  },
  {
    input: '="123".LEN()',
    parseErrorType: 'syntax',
    errorMessage: 'LEN is not chainable'
  },
  // Predicate
  {
    input: '==1',
    label: 'TODO predicate ==1',
    parseErrorType: 'syntax',
    errorMessage: 'TODO mismatch token startExpression'
  },
  {
    input: '= =1',
    value: { type: 'number', result: 1 }
  },
  {
    input: '=>=3',
    value: { type: 'number', result: 3 }
  },
  {
    input: '=!="foo"',
    value: { type: 'string', result: 'foo' }
  },
  {
    input: '=>=true',
    debug: true,
    label: 'Predicate check type',
    parseErrorType: 'syntax',
    errorMessage: 'Expected number but got boolean'
  },
  {
    input: '=<>"123"',
    value: { type: 'string', result: '123' }
  },
  {
    input: '= <= (1+1)',
    value: { type: 'number', result: 2 }
  },
  // Type
  {
    input: '=ABS ( "a" )',
    parseErrorType: 'syntax',
    errorMessage: 'Expected number but got string'
  },
  {
    input: '=IF(1, -3, -4)',
    parseErrorType: 'syntax',
    errorMessage: 'Expected boolean but got number'
  },
  {
    input: '=ABS( NOW() )',
    parseErrorType: 'syntax',
    errorMessage: 'Expected number but got Date'
  },
  {
    input: '=ABS ( true )',
    parseErrorType: 'syntax',
    errorMessage: 'Expected number but got boolean'
  },
  // TODO List
  {
    input: '= 中文',
    label: 'TODO chinese',
    parseErrorType: 'syntax',
    errorMessage: 'Parse error:'
  },
  {
    input: '= 1a1',
    label: 'TODO 1a1',
    parseErrorType: 'syntax',
    errorMessage: 'Not all input parsed: a1'
  },
  {
    input: '=varvarabc中文var',
    label: 'TODO chinese2',
    parseErrorType: 'syntax',
    errorMessage: 'Unknown function varvarabc'
  },
  {
    input: '= nottrue',
    label: 'not is a operator',
    parseErrorType: 'syntax',
    errorMessage: 'Unknown function nottrue'
  },
  {
    input: '=1.T()',
    label: 'should success',
    parseErrorType: 'syntax',
    value: 1
  },
  {
    input: '=1.START_WITH("123")',
    parseErrorType: 'syntax',
    errorMessage: 'Expected string but got number'
  },
  {
    input: '=123.ABS()',
    parseErrorType: 'syntax',
    errorMessage: 'core::ABS is not chainable'
  }
]

describe('Simple test case', () => {
  let ctx: Awaited<ReturnType<typeof makeContext>>
  beforeAll(async () => {
    ctx = await makeContext({
      pages: [
        {
          pageName: 'Page1',
          pageId: namespaceId,
          variables: [
            {
              variableId: bazVariableId,
              definition: '=25',
              variableName: 'baz'
            }
          ]
        },
        {
          pageName: 'Untitled',
          pageId: barNamespaceId,
          variables: [
            {
              variableId: barVariableId,
              definition: '=24',
              variableName: 'bar'
            }
          ]
        }
      ]
    })
  })

  testCases.forEach(({ input, label, parseErrorType, errorMessage, value, debug, display }) => {
    const prefix = label ? `[${label}] ` : ''
    const suffix = value !== undefined ? ` // => ${value}` : ' // => ✗'
    it(`${prefix}${input}${suffix}`, async () => {
      const newMeta = { ...ctx.meta, input }
      const parseResult = parse({ ...ctx, meta: newMeta })
      const {
        success,
        variableParseResult: { cst, kind, codeFragments, definition: newInput },
        errorType,
        errorMessages,
        completions,
        inputImage,
        parseImage
      } = parseResult

      if (kind === 'literal') {
        expect(completions.length).toEqual(0)
      } else {
        expect(completions.length).not.toEqual(0)
      }

      if (label) {
        expect(codeFragments).toMatchSnapshot()
      }

      if (debug) {
        expect(cst).toMatchSnapshot()
        expect({ newInput, input, inputImage, parseImage }).toMatchSnapshot()
      }

      if (value !== undefined) {
        const variableValue = await innerInterpret({ parseResult, ctx: { ...ctx, meta: newMeta } })
        const displayResult = displayValue(variableValue.result, '')

        expect(errorMessages).toEqual([])

        expect(errorType).toEqual(undefined)
        expect(success).toEqual(true)

        if (display) {
          expect(displayResult).toEqual(display)
        } else {
          expect(variableValue.result.result).toEqual(value)
          expect(variableValue.success).toEqual(true)
        }
      } else if (parseErrorType) {
        expect(errorMessages[0]).not.toEqual(undefined)
        expect(errorMessages[0]!.message).toContain(errorMessage)
        expect(errorType).toEqual(parseErrorType)
      } else {
        throw new Error('Unexpected error')
      }
    })
  })
})
