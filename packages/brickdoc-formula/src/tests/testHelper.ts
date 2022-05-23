import { generateVariable, interpret, parse } from '../grammar/core'
import { FormulaContext, FormulaContextArgs } from '../context'
import { dispatchFormulaBlockNameChangeOrDelete } from '../events'
import {
  BaseFunctionClause,
  ContextInterface,
  FunctionContext,
  InterpretContext,
  NumberResult,
  VariableMetadata
} from '../types'
import { Cell, Column, Row, SpreadsheetClass, SpreadsheetType } from '../controls'
import { FixedLengthTuple } from '@brickdoc/active-support'
import { columnDisplayIndex } from '../grammar'

const uuids = [...Array(999)].map((o, index) => `00000000-0000-${String(index).padStart(4, '0')}-0000-000000000000`)

interface VariableInput {
  variableName: string
  variableId?: string
  definition: string
  position?: number
}

interface ColumnInput<RowCount extends number> {
  columnId?: string
  name: string
  displayIndex?: string
  cells: FixedLengthTuple<CellInput, RowCount>
}

interface CellInput extends Pick<Cell, 'value'> {
  cellId?: string
}

interface RowInput {
  rowId?: string
}
export interface SpreadsheetInput<ColumnCount extends number, RowCount extends number> {
  spreadsheetId?: string
  name: string
  columns: FixedLengthTuple<ColumnInput<RowCount>, ColumnCount>
  rows?: FixedLengthTuple<RowInput, RowCount>
}
export interface PageInput {
  pageId?: string
  pageName: string
  variables?: VariableInput[]
  spreadsheets?: Array<SpreadsheetInput<any, any>>
}

interface makeContextOptions {
  initializeOptions?: FormulaContextArgs
  pages: PageInput[]
  insertOptions?: InsertOptions
}

interface InsertOptions {
  ignoreError?: true
}

const quickInsert = async (ctx: FunctionContext, { ignoreError }: InsertOptions): Promise<void> => {
  const parseResult = parse(ctx)
  if (!parseResult.success && !ignoreError) {
    throw new Error(parseResult.errorMessages[0]!.message)
  }

  const tempT = await interpret({ parseResult, ctx })
  const variable = generateVariable({ formulaContext: ctx.formulaContext, t: tempT })

  await variable.t.task.variableValue
  await variable.save()
}

const buildSpreadsheet = (
  namespaceId: string,
  oldCounter: number,
  formulaContext: ContextInterface,
  { spreadsheetId: oldSpreadsheetId, name, rows, columns }: SpreadsheetInput<number, number>
): [SpreadsheetType, number] => {
  let counter = oldCounter
  const spreadsheetId = oldSpreadsheetId ?? uuids[counter++]
  if (columns.length === 0) {
    return [
      new SpreadsheetClass({
        name,
        ctx: { formulaContext },
        dynamic: false,
        spreadsheetId,
        namespaceId,
        columns: [],
        rows: [],
        getCell: ({ rowId, columnId }) => null!
      }),
      counter
    ]
  }
  const rowSize = ([...columns][0] as ColumnInput<number>).cells.length
  const columnResult: Column[] = columns.map(
    ({ columnId, name, displayIndex }: ColumnInput<number>, index: number) => ({
      spreadsheetId,
      columnId: columnId ?? uuids[counter++],
      name,
      title: name,
      displayIndex: displayIndex ?? columnDisplayIndex(index),
      index,
      sort: index
    })
  )

  if (rowSize === 0) {
    return [
      new SpreadsheetClass({
        name,
        ctx: { formulaContext },
        dynamic: false,
        spreadsheetId,
        namespaceId,
        columns: columnResult,
        rows: [],
        getCell: ({ rowId, columnId }) => null!
      }),
      counter
    ]
  }

  const rowResult: Row[] = (rows ?? [...Array(rowSize)].map((): RowInput => ({}))).map(
    ({ rowId }: RowInput, index: number) => ({
      spreadsheetId,
      rowId: rowId ?? uuids[counter++],
      rowIndex: index
    })
  )

  const cells: Cell[] = columns.flatMap(({ cells }: ColumnInput<number>, columnIndex: number) => {
    return cells.map((cell: CellInput, rowIndex: number) => ({
      namespaceId,
      rowId: rowResult[rowIndex].rowId,
      spreadsheetId,
      rowIndex,
      columnIndex,
      columnId: columnResult[columnIndex].columnId,
      value: cell.value,
      displayData: undefined,
      cellId: cell.cellId ?? uuids[counter++]
    }))
  })

  return [
    new SpreadsheetClass({
      name,
      ctx: { formulaContext },
      dynamic: false,
      spreadsheetId,
      namespaceId,
      columns: columnResult,
      rows: rowResult,
      getCell: ({ rowId, columnId }) => cells.find(cell => cell.rowId === rowId && cell.columnId === columnId)!
    }),
    counter
  ]
}

const functionClauses: Array<BaseFunctionClause<any>> = [
  {
    name: 'PLUS',
    async: false,
    pure: true,
    lazy: false,
    persist: false,
    acceptError: false,
    effect: false,
    args: [
      {
        type: 'number',
        name: 'a'
      },
      {
        type: 'number',
        name: 'b'
      }
    ],
    examples: [{ input: '=1', output: { type: 'number', result: 1 } }],
    description: '',
    group: 'custom',
    returns: 'number',
    testCases: [],
    chain: false,
    reference: (ctx, a: NumberResult, b: NumberResult) => ({ type: 'number', result: a.result + b.result })
  },
  {
    name: 'FORTY_TWO',
    async: false,
    lazy: false,
    persist: false,
    acceptError: false,
    pure: true,
    effect: false,
    args: [],
    examples: [{ input: '=1', output: { type: 'number', result: 1 } }],
    description: '',
    group: 'custom',
    returns: 'number',
    testCases: [],
    chain: false,
    reference: () => ({ type: 'number', result: 42 })
  }
]

const defaultInitializeOptions: FormulaContextArgs = {
  domain: 'test',
  functionClauses
}

export const makeContext = async ({
  pages,
  insertOptions,
  initializeOptions
}: makeContextOptions): Promise<FunctionContext> => {
  const formulaContext = new FormulaContext(initializeOptions ?? defaultInitializeOptions)
  const interpretContext: InterpretContext = {
    ctx: { bar: { type: 'string', result: 'bar123' } },
    arguments: [{ type: 'string', result: 'Foo1234123' }]
  }

  let counter = 0
  let firstNamespaceId
  for (const { pageId, pageName, variables, spreadsheets } of [...pages]) {
    const namespaceId = pageId ?? uuids[counter++]
    if (!firstNamespaceId) firstNamespaceId = namespaceId
    dispatchFormulaBlockNameChangeOrDelete({ id: namespaceId, name: pageName, deleted: false })

    for (const { variableName, variableId, definition, position } of variables ?? []) {
      await quickInsert(
        {
          formulaContext,
          interpretContext,
          meta: {
            namespaceId,
            name: variableName,
            variableId: variableId ?? uuids[counter++],
            input: definition,
            position: position ?? 0,
            richType: { type: 'normal' }
          }
        },
        insertOptions ?? {}
      )
    }

    for (const spreadsheetInput of spreadsheets ?? []) {
      const [spreadsheet, newCounter] = buildSpreadsheet(namespaceId, counter, formulaContext, spreadsheetInput)
      counter = newCounter
      formulaContext.setSpreadsheet(spreadsheet)
    }
  }

  const meta: VariableMetadata = {
    variableId: 'uuiduuid-input-uuiduuid',
    namespaceId: firstNamespaceId ?? 'uuiduuid-namespaceId-uuiduuid',
    name: 'testInput',
    input: '!!!',
    position: 0,
    richType: { type: 'normal' }
  }

  return { formulaContext, interpretContext, meta }
}
