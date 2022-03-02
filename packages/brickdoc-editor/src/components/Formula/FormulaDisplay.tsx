import React from 'react'
import { Button, Icon, Input } from '@brickdoc/design-system'
import {
  SpreadsheetContainer,
  SpreadsheetPanel,
  SpreadsheetRowAction,
  SpreadsheetScrollView,
  SpreadsheetView,
  SpreadsheetHeader,
  SpreadsheetHeaderColumn,
  SpreadsheetBody,
  SpreadsheetRow,
  SpreadsheetCellContainer,
  useSpreadsheetContext
} from '..'
import {
  ButtonResult,
  InputResult,
  SpreadsheetResult,
  StringResult,
  AnyTypeResult,
  FormulaSourceType,
  VariableDisplayData
} from '@brickdoc/formula'
import { FormulaValue } from './FormulaValue'

// TODO refactor me
const renderTable = (result: SpreadsheetResult, formulaType: FormulaSourceType): React.ReactElement => {
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

const renderButton = (result: ButtonResult, formulaType: FormulaSourceType): React.ReactElement => {
  return (
    <Button disabled={result.result.disabled} onClick={result.result.onClick}>
      {result.result.name}
    </Button>
  )
}

const renderInput = (result: InputResult, formulaType: FormulaSourceType): React.ReactElement => {
  return (
    <Input
      disabled={result.result.disabled}
      onChange={e => result.result.onChange?.(e.target.value)}
      value={result.result.value}
    />
  )
}

const renderQrcode = (result: StringResult, formulaType: FormulaSourceType): React.ReactElement => {
  return <span>[QRCODE] {result.result}</span>
}

const renderLiteral = (result: AnyTypeResult, formulaType: FormulaSourceType): React.ReactElement => {
  return <span>{result.result}</span>
}

export interface FormulaDisplayProps {
  displayData?: VariableDisplayData
  display?: string
  formulaType: FormulaSourceType
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ displayData, display, formulaType, ...props }) => {
  if (!displayData) {
    if (formulaType === 'normal') {
      return (
        <span {...props} className="brickdoc-formula-placeholder">
          <Icon.Formula className="brickdoc-formula-placeholder-icon" />
        </span>
      )
    }
    return <div />
  }

  const { result, kind, type } = displayData

  if (kind === 'literal') {
    return <span {...props}>{renderLiteral(result, type)}</span>
  }

  let preview: React.ReactElement | null = <></>

  switch (result.view?.type ?? result.type) {
    case 'Button':
      preview = renderButton(result as ButtonResult, type)
      break
    case 'Input':
      preview = renderInput(result as InputResult, type)
      break
    case 'Spreadsheet':
      preview = renderTable(result as SpreadsheetResult, type)
      break
    case 'Qrcode':
      preview = renderQrcode(result as StringResult, type)
      break
    default:
      break
  }

  return (
    <>
      <span {...props}>
        <FormulaValue displayData={displayData} display={display!} border={true} />
      </span>
      {preview}
    </>
  )
}
