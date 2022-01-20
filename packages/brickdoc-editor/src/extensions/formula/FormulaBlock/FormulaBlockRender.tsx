/* eslint-disable no-nested-ternary */
import React from 'react'
import { Icon, Popover, Tooltip } from '@brickdoc/design-system'
import { BlockContainer, FormulaMenu } from '../../../components'
import './FormulaBlock.less'
import { EditorDataSourceContext } from '../../../dataSource/DataSource'
import { VariableInterface, FormulaSourceType } from '@brickdoc/formula'
import { FormulaRender } from '../../../components/Formula/FormulaRender'
import { useFormula } from '../../../components/Formula/useFormula'
import { FormulaResult } from '../../../components/Formula/FormulaResult'
import { FormulaEditor } from '../FormulaEditor/FormulaEditor'

export interface FormulaBlockRenderProps {
  formulaId: string
  formulaName?: string
  formulaType: FormulaSourceType
  rootId: string
  defaultVisible?: boolean
  saveOnBlur?: boolean
  handleTurnOffVisible?: () => void
  handleDelete: (variable: VariableInterface) => void
  updateFormula: (variable: VariableInterface) => void
}

export const FormulaBlockRender: React.FC<FormulaBlockRenderProps> = ({
  formulaId,
  rootId,
  formulaName,
  formulaType,
  handleTurnOffVisible,
  defaultVisible = false,
  saveOnBlur = false,
  updateFormula,
  handleDelete
}) => {
  const editorDataSource = React.useContext(EditorDataSourceContext)
  const formulaContext = editorDataSource.formulaContext
  const [variable, updateVariable] = React.useState(formulaContext?.findVariable(rootId, formulaId))
  const isDraft = variable?.isDraft() === true
  const variableT = variable?.t

  const {
    doCalculate,
    setName,
    isDisableSave,
    name,
    error,
    doHandleSave,
    formulaIsNormal,
    defaultName,
    content,
    position,
    completions,
    handleSelectActiveCompletion,
    setActiveCompletion,
    activeCompletionIndex,
    setActiveCompletionIndex,
    activeCompletion
  } = useFormula({
    rootId,
    formulaId,
    formulaContext,
    updateFormula,
    formulaType,
    variable,
    updateVariable,
    formulaName
  })

  const handleDefaultPopoverVisibleChange = (visible: boolean): void => {
    if (!visible && defaultVisible) {
      handleTurnOffVisible?.()
    }
  }

  const formulaResult = (
    <FormulaResult
      error={error}
      rootId={rootId}
      variable={variable}
      completions={completions}
      handleSelectActiveCompletion={handleSelectActiveCompletion}
      setActiveCompletion={setActiveCompletion}
      activeCompletionIndex={activeCompletionIndex}
      setActiveCompletionIndex={setActiveCompletionIndex}
      activeCompletion={activeCompletion}
    />
  )

  if (formulaIsNormal) {
    const resultData = <FormulaRender t={variableT} formulaType={formulaType} />
    const renderData =
      !variableT || isDraft ? (
        <span className="brickdoc-formula-placeholder">
          <Icon.Formula className="brickdoc-formula-placeholder-icon" />
        </span>
      ) : (
        <Tooltip title={variableT.name}>{resultData}</Tooltip>
      )

    return (
      <BlockContainer inline={true}>
        <FormulaMenu
          doCalculate={doCalculate}
          setName={setName}
          formulaResult={formulaResult}
          content={content}
          position={position}
          defaultVisible={defaultVisible}
          onVisibleChange={handleDefaultPopoverVisibleChange}
          isDisableSave={isDisableSave}
          doHandleSave={doHandleSave}
          variable={variable}
          defaultName={defaultName}
          name={name}
          handleDelete={handleDelete}
        >
          {renderData}
        </FormulaMenu>
      </BlockContainer>
    )
  }

  const onEditorBlur = (): void => {
    if (saveOnBlur) {
      void doHandleSave()
    }
  }

  const editor = <FormulaEditor content={content} position={position} editable={true} onBlur={onEditorBlur} />

  if (!variableT || variableT.kind === 'literal') {
    return editor
  }

  return (
    <Popover
      defaultVisible={defaultVisible}
      visible={true}
      overlayClassName="brickdoc-formula-menu-popover"
      destroyTooltipOnHide={true}
      content={formulaResult}
      placement="bottom"
      trigger={['click']}
    >
      {editor}
    </Popover>
  )
}
