import { RequireField } from '@brickdoc/active-support'
import { OPERATORS } from '../grammar'
import { ErrorType } from '../types'
import { PageInput } from './testHelper'

interface SuccessTestCaseType {
  definition: string
  group?: string
  label?: string
  result: any
}

interface ErrorTestCaseType {
  definition: string
  group?: string
  valid?: boolean
  label?: string
  errorType: ErrorType
  errorMessage: string
}

export interface TestCaseType {
  pages?: PageInput[]
  successTestCases?: SuccessTestCaseType[]
  errorTestCases?: ErrorTestCaseType[]
}

export const NAME_SPECIAL_INVALID_CHARS = [...'()[]{}!@#$%^&*-+=|\\:;\'"<>,./?`~', ' ', '\t', '\n', '\r', '\u2003']
export const NAME_VALID_SUFFIX_ONLY = ['中文', 'é', '😉', '1', '감사']
export const BUILTIN_STRINGS = ['in', 'EXACTIN', 'true', 'False', 'and', 'not', 'Null', 'Or']
export const NAME_VALID_PREFIX = ['a', '_', ...BUILTIN_STRINGS]

const ALL_TEST_CASES: TestCaseType[] = OPERATORS.filter(o => o.testCases).map(o => ({
  ...o.testCases!,
  successTestCases: o.testCases!.successTestCases?.map(s => ({
    ...s,
    group: o.name,
    label: s.label ? `[${s.label}]` : ''
  })),
  errorTestCases: o.testCases!.errorTestCases?.map(s => ({
    ...s,
    group: o.name,
    label: s.label ? `[${s.label}]` : ''
  }))
}))

export const SUCCESS_TEST_CASE = ALL_TEST_CASES.reduce<RequireField<TestCaseType, 'pages' | 'successTestCases'>>(
  (prev, curr) => ({
    successTestCases: [...(prev.successTestCases ?? []), ...(curr.successTestCases ?? [])],
    pages: [...(prev.pages ?? []), ...(curr.pages ?? [])]
  }),
  { pages: [], successTestCases: [] }
)

export const ERROR_TEST_CASE = ALL_TEST_CASES.reduce<RequireField<TestCaseType, 'pages' | 'errorTestCases'>>(
  (prev, curr) => ({
    errorTestCases: [...(prev.errorTestCases ?? []), ...(curr.errorTestCases ?? [])],
    pages: [...(prev.pages ?? []), ...(curr.pages ?? [])]
  }),
  { pages: [], errorTestCases: [] }
)

const ASYNC_SUCCESS_DEFINITIONS: SuccessTestCaseType[] = [
  { definition: '=SLEEP(123)', result: 123 },
  {
    definition: '=SLEEP(123)+1',
    result: 124
  },
  {
    definition: '=1+SLEEP(123)',
    result: 124
  },
  {
    definition: '=SLEEP( 123 )+SLEEP(1+1)',
    result: 125
  }
]

export const ASYNC_TEST_CASE: RequireField<TestCaseType, 'pages' | 'successTestCases'> = {
  pages: [
    {
      pageName: 'Async',
      variables: [{ variableName: 'foo', definition: '=SLEEP(24)' }]
    }
  ],
  successTestCases: [...ASYNC_SUCCESS_DEFINITIONS, { definition: '=foo+1', result: 25 }]
}

export const PARSE_ERROR_DEFINITIONS: ErrorTestCaseType[] = []

export const RUNTIME_ERROR_DEFINITIONS: ErrorTestCaseType[] = []
