import { CodeFragmentVisitor } from '../grammar'
import { CodeFragment, ErrorMessage, FormulaType, SpreadsheetId, uuid } from '../types'
import { CellType, Row, RowType, SpreadsheetType } from './types'

export class RowClass implements RowType {
  spreadsheetId: SpreadsheetId
  rowId: uuid
  rowIndex: number
  spreadsheet: SpreadsheetType
  logic: boolean

  constructor(spreadsheet: SpreadsheetType, { spreadsheetId, rowId, rowIndex }: Row, logic: boolean) {
    this.spreadsheetId = spreadsheetId
    this.rowId = rowId
    this.rowIndex = rowIndex

    this.spreadsheet = spreadsheet
    this.logic = logic
  }

  listCells: () => CellType[] = () => {
    return this.spreadsheet.listCells({ rowId: this.rowId })
  }

  persistence(): Row {
    return {
      rowIndex: this.rowIndex,
      rowId: this.rowId,
      spreadsheetId: this.spreadsheetId
    }
  }

  // private findCellByNumber(name: string): CellResult | ErrorResult {
  //   const number = Number(name)
  //   if (isNaN(number)) {
  //     return { type: 'Error', result: `Need a number: ${name}`, errorKind: 'syntax' }
  //   }
  //   const cells = this.cells()

  //   if (number > cells.length) {
  //     return { type: 'Error', result: `Cell out of range: ${cells.length}`, errorKind: 'runtime' }
  //   }

  //   return { type: 'Cell', result: cells[number - 1] }
  // }

  handleCodeFragments(
    visitor: CodeFragmentVisitor,
    name: string,
    codeFragments: CodeFragment[]
  ): { errors: ErrorMessage[]; firstArgumentType: FormulaType | undefined; codeFragments: CodeFragment[] } {
    // const cell = this.findCellByNumber(name)
    const errors: ErrorMessage[] = []

    // if (cell.type === 'Error') {
    //   errors.push({ type: cell.errorKind, message: cell.result })
    //   return {
    //     errors,
    //     firstArgumentType: undefined,
    //     codeFragments
    //   }
    // }

    return {
      errors,
      firstArgumentType: undefined,
      codeFragments
    }

    // const spreadsheetEventDependency = visitor.eventDependencies
    //   .reverse()
    //   .find(
    //     d =>
    //       d.kind === 'Column' &&
    //       d.event === SpreadsheetReloadViaId &&
    //       d.eventId === `${this.spreadsheet.namespaceId},${this.spreadsheetId}`
    //   )

    // if (spreadsheetEventDependency) {
    //   spreadsheetEventDependency.kind = 'Cell'
    //   spreadsheetEventDependency.scopes.push(
    //     { keys: [name], kind: 'Row' },
    //     {
    //       keys: [this.logic ? this.displayIndex : this.columnId],
    //       kind: 'Column'
    //     }
    //   )
    // }

    // const firstArgumentType = 'Cell'
    // const finalRhsCodeFragments = codeFragments

    // return {
    //   errors,
    //   firstArgumentType,
    //   codeFragments: finalRhsCodeFragments
    // }
  }
}
