import {
  ContextInterface,
  BasicFunctionClause,
  NumberResult,
  ColumnResult,
  SpreadsheetResult,
  ErrorResult,
  PredicateResult,
  PredicateFunction,
  StringResult
} from '..'
import { buildPredicate } from '../grammar/predicate'

export const SUM = (ctx: ContextInterface, { result: column }: ColumnResult): NumberResult | ErrorResult => {
  const database = ctx.findDatabase(column.namespaceId)
  if (!database) {
    return { type: 'Error', result: 'Database not found', errorKind: 'runtime' }
  }

  const rows: number[] = database.listRows().map(row => Number(row[column.columnId]) || 0)
  return { type: 'number', result: rows.reduce((a, b) => a + b, 0) }
}

export const COLUMN_COUNT = (ctx: ContextInterface, database: SpreadsheetResult): NumberResult => {
  return { type: 'number', result: database.result.columnCount() }
}

export const ROW_COUNT = (ctx: ContextInterface, database: SpreadsheetResult): NumberResult => {
  return { type: 'number', result: database.result.rowCount() }
}

export const SUMIFS = (
  ctx: ContextInterface,
  { result: column1 }: ColumnResult,
  { result: column2 }: ColumnResult,
  predicate: PredicateResult
): NumberResult | ErrorResult => {
  if (column1.namespaceId !== column2.namespaceId) {
    return { type: 'Error', result: 'Columns must be in the same namespace', errorKind: 'runtime' }
  }

  const database = ctx.findDatabase(column1.namespaceId)
  if (!database) {
    return { type: 'Error', result: 'Database not found', errorKind: 'runtime' }
  }

  const predicateFunction: PredicateFunction = buildPredicate(predicate)
  let sum: number = 0

  database.listRows().forEach(row => {
    const value1 = Number(row[column1.columnId])
    const value2 = Number(row[column2.columnId])
    if (value1 && predicateFunction(value2)) {
      sum += value1
    }
  })

  return { type: 'number', result: sum }
}

export const VLOOKUP = (
  ctx: ContextInterface,
  { result: match }: StringResult,
  { result: database }: SpreadsheetResult,
  { result: column }: ColumnResult
): StringResult | ErrorResult => {
  if (database.blockId !== column.namespaceId) {
    return { type: 'Error', result: 'Column must be in the same namespace', errorKind: 'runtime' }
  }

  const columns = database.listColumns()

  const firstColumn = columns[0]
  if (!firstColumn) {
    return { type: 'Error', result: 'Database is empty', errorKind: 'runtime' }
  }

  if (firstColumn.columnId === column.columnId) {
    return { type: 'Error', result: 'Column cannot be the same as the first column', errorKind: 'runtime' }
  }

  if (!columns.find(c => c.columnId === column.columnId)) {
    return { type: 'Error', result: 'Column not found', errorKind: 'runtime' }
  }

  let result: StringResult | ErrorResult = { type: 'Error', result: 'Not found', errorKind: 'runtime' }

  database.listRows().forEach(row => {
    if (row[firstColumn.columnId] === match) {
      result = { type: 'string', result: row[column.columnId] ?? '' }
    }
  })

  return result
}

const VLOOKUP_CLAUSE: BasicFunctionClause<'string'> = {
  name: 'VLOOKUP',
  async: false,
  pure: false,
  effect: false,
  examples: [{ input: '=123', output: { type: 'string', result: 'foo' } }],
  description: 'Returns the value of the column in the database that matches the match value.',
  group: 'core',
  args: [
    {
      name: 'match',
      type: 'string'
    },
    {
      name: 'database',
      type: 'Spreadsheet'
    },
    {
      name: 'column',
      type: 'Column'
    }
  ],
  returns: 'string',
  testCases: [],
  chain: true,
  reference: VLOOKUP
}

const NUMBER_CLAUSES: Array<BasicFunctionClause<'number'>> = [
  {
    name: 'SUM',
    async: false,
    pure: false,
    effect: false,
    examples: [{ input: '=123', output: { type: 'number', result: 123 } }],
    description: 'Returns the sum of the column in the database.',
    group: 'core',
    args: [
      {
        name: 'column',
        type: 'Column'
      }
    ],
    returns: 'number',
    testCases: [],
    chain: true,
    reference: SUM
  },
  {
    name: 'COLUMN_COUNT',
    async: false,
    pure: false,
    effect: false,
    examples: [{ input: '=123', output: { type: 'number', result: 123 } }],
    description: 'Returns the column size of the database.',
    group: 'core',
    args: [
      {
        name: 'database',
        type: 'Spreadsheet'
      }
    ],
    returns: 'number',
    testCases: [],
    chain: true,
    reference: COLUMN_COUNT
  },
  {
    name: 'ROW_COUNT',
    async: false,
    pure: false,
    effect: false,
    examples: [{ input: '=123', output: { type: 'number', result: 123 } }],
    description: 'Returns the row size of the database.',
    group: 'core',
    args: [
      {
        name: 'database',
        type: 'Spreadsheet'
      }
    ],
    returns: 'number',
    testCases: [],
    chain: true,
    reference: ROW_COUNT
  },
  {
    name: 'SUMIFS',
    async: false,
    pure: false,
    effect: false,
    examples: [{ input: '=123', output: { type: 'number', result: 123 } }],
    description: 'Returns the sum of the column in the database.',
    group: 'core',
    args: [
      {
        name: 'column1',
        type: 'Column'
      },
      {
        name: 'column2',
        type: 'Column'
      },
      {
        name: 'condition',
        type: 'Predicate'
      }
    ],
    returns: 'number',
    testCases: [],
    chain: true,
    reference: SUMIFS
  }
]

export const CORE_DATABASE_CLAUSES: Array<BasicFunctionClause<any>> = [VLOOKUP_CLAUSE, ...NUMBER_CLAUSES]
