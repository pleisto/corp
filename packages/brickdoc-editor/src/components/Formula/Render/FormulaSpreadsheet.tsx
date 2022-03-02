import { SpreadsheetResult, FormulaSourceType } from '@brickdoc/formula'
import {
  useSpreadsheetContext,
  SpreadsheetContainer,
  SpreadsheetPanel,
  SpreadsheetRowAction,
  SpreadsheetScrollView,
  SpreadsheetView,
  SpreadsheetHeader,
  SpreadsheetHeaderColumn,
  SpreadsheetBody,
  SpreadsheetRow,
  SpreadsheetCellContainer
} from '../../Spreadsheet'

export interface FormulaSpreadsheetProps {
  result: SpreadsheetResult
  formulaType: FormulaSourceType
}

// TODO refactor me
export const FormulaSpreadsheet: React.FC<FormulaSpreadsheetProps> = ({ result }) => {
  const spreadsheet = result.result
  const columns = spreadsheet.listColumns()
  const rows = spreadsheet.listRows()

  const valuesMatrix = new Map(
    rows.map(r => {
      const { rowId } = r
      return [
        r.rowId,
        new Map(columns.map(c => [c.columnId, spreadsheet.findCellValue({ columnId: c.columnId, rowId }) ?? '']))
      ]
    })
  )

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const spreadsheetContext = useSpreadsheetContext({
    rowIds: rows.map(r => r.rowId),
    columnIds: columns.map(c => c.columnId),
    columnHeaders: new Map(columns.map(c => [c.columnId, c.name])),
    valuesMatrix
  })
  return (
    <SpreadsheetContainer context={spreadsheetContext} className="brickdoc-formula-spreadsheet">
      <div className="spreadsheet-title">{spreadsheet.name()}</div>
      <SpreadsheetPanel context={spreadsheetContext}>
        {rows.map(({ rowId }, rowIdx) => {
          const rowNumber = String((rowIdx as number) + 1)
          return <SpreadsheetRowAction key={rowIdx} context={spreadsheetContext} rowId={rowId} rowNumber={rowNumber} />
        })}
      </SpreadsheetPanel>
      <SpreadsheetScrollView>
        <SpreadsheetView>
          <SpreadsheetHeader context={spreadsheetContext}>
            {columns.map(c => (
              <SpreadsheetHeaderColumn key={c.columnId} context={spreadsheetContext} columnId={c.columnId}>
                <div className="column">{c.name}</div>
              </SpreadsheetHeaderColumn>
            ))}
          </SpreadsheetHeader>
          <SpreadsheetBody>
            {rows.map(({ rowId }, rowIdx) => {
              return (
                <SpreadsheetRow key={rowIdx} context={spreadsheetContext} rowId={rowId}>
                  {columns.map(c => (
                    <SpreadsheetCellContainer
                      key={c.columnId}
                      context={spreadsheetContext}
                      cellId={{ rowId, columnId: c.columnId }}
                    >
                      <div className="column">{valuesMatrix.get(rowId)?.get(c.columnId)}</div>
                    </SpreadsheetCellContainer>
                  ))}
                </SpreadsheetRow>
              )
            })}
          </SpreadsheetBody>
        </SpreadsheetView>
      </SpreadsheetScrollView>
    </SpreadsheetContainer>
  )
}
