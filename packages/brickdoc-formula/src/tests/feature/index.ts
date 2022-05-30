import { TestCaseInterface } from '../testType'
import { FunctionCallTestCase } from './functionCall'
import { NameTestCase } from './name'
import { PowerFxTestCase } from './powerfx'
import { SpreadsheetTestCase } from './spreadsheet'
import { VariableTestCase } from './variable'

export const FeatureTestCases: TestCaseInterface[] = [
  FunctionCallTestCase,
  VariableTestCase,
  PowerFxTestCase,
  SpreadsheetTestCase,
  NameTestCase
]
