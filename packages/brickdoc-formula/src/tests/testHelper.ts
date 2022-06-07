import { generateVariable, interpret, parse } from '../grammar/core'
import { FormulaContext, FormulaContextArgs } from '../context'
import { dispatchFormulaBlockNameChangeOrDelete } from '../events'
import { ContextInterface, FunctionContext, InterpretContext } from '../types'
import { Cell, Column, Row, SpreadsheetClass, SpreadsheetType } from '../controls'
import { columnDisplayIndex } from '../grammar'
import {
  BaseTestCase,
  CellInput,
  ColumnInput,
  InsertOptions,
  MakeContextOptions,
  MakeContextResult,
  RowInput,
  SpreadsheetInput,
  uuids
} from './testType'
import { uuid } from '@brickdoc/active-support'

const quickInsert = async (
  ctx: FunctionContext,
  { ignoreParseError, ignoreSyntaxError }: InsertOptions
): Promise<void> => {
  const parseResult = parse(ctx)
  if (!parseResult.success && !ignoreParseError) {
    throw new Error(parseResult.errorMessages[0]!.message)
  }

  const tempT = await interpret({ parseResult, ctx })
  const variable = generateVariable({ formulaContext: ctx.formulaContext, t: tempT })

  const result = await variable.t.task.variableValue
  if (!ignoreSyntaxError) {
    if (result.result.type === 'Error' && !['runtime'].includes(result.result.errorKind)) {
      throw new Error(result.result.result)
    }
  }
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

const defaultInitializeOptions: FormulaContextArgs = { domain: 'test' }

export const makeContext = async ({ pages, initializeOptions }: MakeContextOptions): Promise<MakeContextResult> => {
  const formulaContext = new FormulaContext(initializeOptions ?? defaultInitializeOptions)
  const interpretContext: InterpretContext = {
    ctx: { bar: { type: 'string', result: 'bar123' } },
    arguments: [{ type: 'string', result: 'Foo1234123' }]
  }

  let counter = 0
  let firstNamespaceId: string | undefined
  const checkVariables: Array<{ namespaceId: string; variableId: string; name: string; result: any }> = []
  for (const { pageId, pageName, variables, spreadsheets } of [...pages]) {
    const namespaceId = pageId ?? uuids[counter++]
    if (!firstNamespaceId) firstNamespaceId = namespaceId
    await dispatchFormulaBlockNameChangeOrDelete({ id: namespaceId, name: pageName, deleted: false })

    for (const { variableName, result, variableId, definition, position, insertOptions } of variables ?? []) {
      const finalVariableId = variableId ?? uuids[counter++]
      await quickInsert(
        {
          formulaContext,
          interpretContext,
          meta: {
            namespaceId,
            name: variableName,
            variableId: finalVariableId,
            input: definition,
            position: position ?? 0,
            richType: { type: 'normal' }
          }
        },
        insertOptions ?? {}
      )
      if (result !== undefined) {
        checkVariables.push({ namespaceId, variableId: finalVariableId, name: variableName, result })
      }
    }

    for (const spreadsheetInput of spreadsheets ?? []) {
      const [spreadsheet, newCounter] = buildSpreadsheet(namespaceId, counter, formulaContext, spreadsheetInput)
      counter = newCounter
      await formulaContext.setSpreadsheet(spreadsheet)
    }
  }

  console.log(checkVariables)
  for (const { namespaceId, variableId, name, result } of checkVariables) {
    const v = formulaContext.findVariableById(namespaceId, variableId)!
    if (!v) throw new Error(`variable ${name} not found`)
    const value = (await v!.t.task.variableValue).result.result
    if (value !== result) throw new Error(`variable ${name} value mismatch: "${value}" !== "${result}"`)
    const v2 = formulaContext.findVariableByName(namespaceId, name)
    if (!v2) throw new Error(`variable ${name} not found`)
    if (v2.t.meta.variableId !== v.t.meta.variableId) throw new Error(`variable ${name} id mismatch`)
  }

  const meta: MakeContextResult['buildMeta'] = args => ({
    variableId: args.variableId ?? uuid(),
    input: args.definition!,
    namespaceId: args.namespaceId ?? firstNamespaceId ?? uuid(),
    name: args.name ?? 'testInput',
    position: 0,
    richType: args.richType ?? { type: 'normal' }
  })

  return { formulaContext, interpretContext, buildMeta: meta }
}

export const trackTodo = (it: jest.It, testCases: Array<BaseTestCase<{}>>): void => {
  testCases
    .filter(t => t.todo)
    .forEach(t => {
      it.todo(`${t.jestTitle} -> ${t.todo!}`)
    })
}
