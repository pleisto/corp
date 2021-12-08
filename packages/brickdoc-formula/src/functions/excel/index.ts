import { BaseFunctionClause } from '../..'
import { EXCEL_DATE_CLAUSES } from './date'
import { EXCEL_LOGIC_CLAUSES } from './logic'
import { EXCEL_MATH_CLAUSES } from './math'
import { EXCEL_STATISTICAL_CLAUSES } from './statistical'
import { EXCEL_TEXT_CLAUSES } from './text'

export const EXCEL_CLAUSES: Array<BaseFunctionClause<any>> = [
  ...EXCEL_MATH_CLAUSES,
  ...EXCEL_LOGIC_CLAUSES,
  ...EXCEL_TEXT_CLAUSES,
  ...EXCEL_STATISTICAL_CLAUSES,
  ...EXCEL_DATE_CLAUSES
]
