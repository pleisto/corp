import { RequireField } from '@brickdoc/active-support'
import { OPERATORS } from '../grammar'
import { FeatureTestCases } from './feature'
import { ErrorTestCaseType, MakeContextOptions, SuccessTestCaseType, TestCaseInterface, TestCaseType } from './testType'

export const NAME_SPECIAL_INVALID_CHARS = [...'()[]{}!@#$%^&*-+=|\\:;\'"<>,./?`~', ' ', '\t', '\n', '\r', '\u2003']
export const NAME_VALID_SUFFIX_ONLY = ['中文', 'é', '😉', '1', '감사']
export const BUILTIN_STRINGS = ['in', 'EXACTIN', 'true', 'False', 'and', 'not', 'Null', 'Or']
export const NAME_VALID_PREFIX = ['a', '_', ...BUILTIN_STRINGS]

const OPERATION_TEST_CASES: TestCaseType[] = [
  ...OPERATORS.filter(o => o.testCases).map<TestCaseInterface>(o => o as TestCaseInterface),
  ...FeatureTestCases
].map((o: TestCaseInterface) => ({
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

interface TestCaseInput extends Required<Pick<TestCaseType, 'successTestCases' | 'errorTestCases'>> {
  options: Required<MakeContextOptions>
}

export const ALL_TEST_CASE = OPERATION_TEST_CASES.reduce<TestCaseInput>(
  (prev, curr) => ({
    options: {
      pages: [...prev.options.pages, ...(curr.pages ?? [])],
      initializeOptions: {
        ...prev.options.initializeOptions,
        functionClauses: [...(prev.options.initializeOptions.functionClauses ?? []), ...(curr.functionClauses ?? [])]
      }
    },
    successTestCases: [...prev.successTestCases, ...(curr.successTestCases ?? [])],
    errorTestCases: [...prev.errorTestCases, ...(curr.errorTestCases ?? [])]
  }),
  {
    options: { pages: [{ pageName: 'Default' }], initializeOptions: { domain: 'test' } },
    successTestCases: [],
    errorTestCases: []
  }
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
