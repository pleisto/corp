import { SpreadsheetColumn } from './useSpreadsheet'

export const columnDisplayTitle = (column: SpreadsheetColumn) => {
  if (column.title && column.title.length > 0) {
    return column.title
  } else {
    // TODO: AA for no.27
    return String.fromCharCode(65 + column.sort)
  }
}
