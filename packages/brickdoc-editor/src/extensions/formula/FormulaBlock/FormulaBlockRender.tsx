/* eslint-disable no-nested-ternary */
import React from 'react'
import { Button, Icon, Input, Tooltip } from '@brickdoc/design-system'
import {
  BlockContainer,
  FormulaMenu,
  SpreadsheetContainer,
  SpreadsheetView,
  SpreadsheetHeader,
  SpreadsheetHeaderColumn,
  SpreadsheetBody,
  SpreadsheetRow,
  SpreadsheetCellContainer,
  useSpreadsheetContext
} from '../../../components'
import { COLOR } from '../../../helpers/color'
import './FormulaBlock.less'
import { EditorDataSourceContext } from '../../../dataSource/DataSource'
import {
  displayValue,
  FormulaType,
  VariableClass,
  VariableInterface,
  ButtonResult,
  InputResult,
  SpreadsheetResult,
  StringResult,
  AnyTypeResult,
  VariableData,
  FormulaSourceType
} from '@brickdoc/formula'

import { BrickdocEventBus, FormulaUpdated } from '@brickdoc/schema'

export interface FormulaBlockRenderProps {
  formulaId: string
  formulaName?: string
  formulaType: FormulaSourceType
  rootId: string
  defaultVisible?: boolean
  handleTurnOffVisible?: () => void
  handleDelete: (variable: VariableInterface) => void
  cacheT?: VariableData
  updateFormula: (variable: VariableInterface) => void
}

export const FormulaBlockRender: React.FC<FormulaBlockRenderProps> = ({
  formulaId,
  rootId,
  formulaName,
  formulaType,
  handleTurnOffVisible,
  defaultVisible = false,
  updateFormula,
  handleDelete,
  cacheT
}) => {
  const editorDataSource = React.useContext(EditorDataSourceContext)
  const formulaContext = editorDataSource.formulaContext
  const [variable, setVariable] = React.useState(formulaContext?.findVariable(rootId, formulaId))
  const [variableT, setVariableT] = React.useState(cacheT ?? variable?.t)
  const isDraft = variable?.isDraft() === true

  React.useEffect(() => {
    if (variable) {
      setVariableT(variable.t)
    }
  }, [variable])

  BrickdocEventBus.subscribe(
    FormulaUpdated,
    e => {
      setVariable(new VariableClass({ t: e.payload.t, formulaContext: e.payload.formulaContext }))
    },
    {
      eventId: `${rootId},${formulaId}`,
      subscribeId: `${rootId},${formulaId}`
    }
  )

  // console.log({ variable, formulaContext, formulaId, rootId })

  const COLOR_ARRAY: { [key in FormulaType]: number } = {
    Date: 6,
    Error: 3,
    Column: 6,
    Block: 6,
    void: 3,
    Spreadsheet: 6,
    Button: 1,
    Switch: 1,
    Select: 1,
    Slider: 1,
    Input: 1,
    Radio: 1,
    Rate: 1,
    number: 0,
    null: 0,
    Predicate: 1,
    Cst: 0,
    Function: 3,
    Reference: 0,
    Blank: 0,
    string: 4,
    boolean: 4,
    any: 6,
    Record: 6,
    Array: 6
  }

  const activeColorIndex =
    variableT && variableT.kind !== 'literal' ? COLOR_ARRAY[variableT.variableValue.result.type as FormulaType] || 0 : 0
  const activeColor = COLOR[activeColorIndex]
  const handleDefaultPopoverVisibleChange = (visible: boolean): void => {
    if (!visible && defaultVisible) {
      handleTurnOffVisible?.()
    }
  }

  const renderTable = (result: SpreadsheetResult): React.ReactNode => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const spreadsheetContext = useSpreadsheetContext()
    const columns = result.result.listColumns()
    const rows = result.result.listRows()
    return (
      <span className="brickdoc-formula-spreadsheet">
        <SpreadsheetContainer>
          <div className="spreadsheet-title">{result.result.name()}</div>
          <SpreadsheetView>
            <SpreadsheetHeader>
              <SpreadsheetHeaderColumn className="row-action-panel" context={spreadsheetContext} columnId="" />
              {columns.map(c => (
                <SpreadsheetHeaderColumn key={c.columnId} context={spreadsheetContext} columnId={c.columnId}>
                  <div className="column">{c.name}</div>
                </SpreadsheetHeaderColumn>
              ))}
            </SpreadsheetHeader>
            <SpreadsheetBody>
              {rows.map((row, rowIdx) => {
                const rowNumber = String((rowIdx as number) + 1)
                return (
                  <SpreadsheetRow key={rowIdx} context={spreadsheetContext} rowId={rowNumber} rowNumber={rowNumber}>
                    {columns.map(c => (
                      <SpreadsheetCellContainer
                        key={c.columnId}
                        context={spreadsheetContext}
                        cellId={{ rowId: rowNumber, columnId: c.columnId }}>
                        <div className="column">{row[c.columnId]}</div>
                      </SpreadsheetCellContainer>
                    ))}
                  </SpreadsheetRow>
                )
              })}
            </SpreadsheetBody>
          </SpreadsheetView>
        </SpreadsheetContainer>
      </span>
    )
  }

  const renderEmpty = (): React.ReactNode => {
    return (
      <span className="brickdoc-formula-placeholder">
        <Icon.Formula className="brickdoc-formula-placeholder-icon" />
      </span>
    )
  }

  const renderOther = (result: AnyTypeResult): React.ReactNode => {
    return (
      <span
        className="brickdoc-formula"
        style={{
          color: activeColor.color,
          borderColor: `rgb(${activeColor.rgb.join(',')}, 0.3)`,
          background: activeColor.label === 'Default' ? 'unset' : `rgb(${activeColor.rgb.join(',')}, 0.1)`
        }}>
        {displayValue(result)}
      </span>
    )
  }

  const renderButton = (result: ButtonResult): React.ReactNode => {
    return (
      <Button disabled={result.result.disabled} onClick={result.result.onClick}>
        {result.result.name}
      </Button>
    )
  }

  const renderInput = (result: InputResult): React.ReactNode => {
    return (
      <Input
        disabled={result.result.disabled}
        onChange={e => result.result.onChange?.(e.target.value)}
        value={result.result.value}
      />
    )
  }

  const renderQrcode = (result: StringResult): React.ReactNode => {
    return <span>[QRCODE] {result.result}</span>
  }

  const renderResult = (result: AnyTypeResult): React.ReactNode => {
    switch (result.view?.type ?? result.type) {
      case 'Button':
        return renderButton(result as ButtonResult)
      case 'Input':
        return renderInput(result as InputResult)
      case 'Spreadsheet':
        return renderTable(result as SpreadsheetResult)
      case 'Qrcode':
        return renderQrcode(result as StringResult)
      default:
        return renderOther(result)
    }
  }

  const renderLiteral = (result: AnyTypeResult): React.ReactNode => {
    return (
      <span
        className="brickdoc-formula"
        style={{
          color: activeColor.color,
          borderColor: `rgb(${activeColor.rgb.join(',')}, 0.3)`,
          background: activeColor.label === 'Default' ? 'unset' : `rgb(${activeColor.rgb.join(',')}, 0.1)`
        }}>
        {result.result}
      </span>
    )
  }

  const renderVariable = (t: VariableData | undefined): React.ReactNode => {
    if (isDraft) return renderEmpty()
    if (!t) return renderEmpty()
    const result = t.variableValue.result

    if (t.kind === 'literal') {
      return renderLiteral(result)
    }

    return <Tooltip title={t.name}>{renderResult(result)}</Tooltip>
  }

  return (
    <BlockContainer inline={true}>
      <FormulaMenu
        formulaId={formulaId}
        formulaType={formulaType}
        formulaName={formulaName}
        rootId={rootId}
        defaultVisible={defaultVisible}
        onVisibleChange={handleDefaultPopoverVisibleChange}
        handleDelete={handleDelete}
        updateFormula={updateFormula}
        variable={variable}
        updateVariable={setVariable}>
        {renderVariable(variableT)}
      </FormulaMenu>
    </BlockContainer>
  )
}
