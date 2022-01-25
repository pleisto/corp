/* eslint-disable no-nested-ternary */
import React from 'react'
import { Icon, Popover } from '@brickdoc/design-system'
import { BlockContainer, FormulaMenu } from '..'
import './FormulaBlockRender.less'
import { VariableInterface, FormulaSourceType, VariableData } from '@brickdoc/formula'
import { FormulaRender } from './FormulaRender'
import { useFormula } from './useFormula'
import { FormulaResult } from './FormulaResult'
import { FormulaEditor } from '../../extensions/formula/FormulaEditor/FormulaEditor'
import { BrickdocEventBus, FormulaEditorSaveEventTrigger } from '@brickdoc/schema'
import { AutocompleteList } from './AutocompleteList/AutocompleteList'

export interface FormulaBlockRenderProps {
  formulaId: string
  formulaName?: string
  formulaType: FormulaSourceType
  rootId: string
  defaultVisible?: boolean
  saveOnBlur?: boolean
  handleTurnOffVisible?: () => void
  handleDelete: (variable?: VariableData) => void
  updateFormula: (variable: VariableInterface | undefined) => void
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
  const {
    doCalculate,
    variableT,
    savedVariableT,
    isDraft,
    isDisableSave,
    name,
    doHandleSave,
    formulaIsNormal,
    defaultName,
    editorContent,
    handleSelectActiveCompletion,
    completion,
    setCompletion
  } = useFormula({
    rootId,
    formulaId,
    updateFormula,
    formulaType,
    formulaName
  })

  console.log('render render', {
    formulaId,
    rootId,
    formulaName,
    formulaType,
    handleTurnOffVisible,
    defaultVisible,
    saveOnBlur,
    updateFormula,
    handleDelete
  })

  const handleDefaultPopoverVisibleChange = React.useCallback(
    (visible: boolean): void => {
      if (!visible && defaultVisible) {
        handleTurnOffVisible?.()
      }
    },
    [defaultVisible, handleTurnOffVisible]
  )

  const formulaResult = (
    <>
      <FormulaResult variableT={variableT} />
      <AutocompleteList
        blockId={rootId}
        completion={completion}
        handleSelectActiveCompletion={handleSelectActiveCompletion}
        setCompletion={setCompletion}
      />
    </>
  )

  const onEditorBlur = React.useCallback((): void => {
    if (saveOnBlur) {
      BrickdocEventBus.dispatch(FormulaEditorSaveEventTrigger({ formulaId, rootId }))
    }
  }, [formulaId, rootId, saveOnBlur])

  if (formulaIsNormal) {
    const renderData =
      !savedVariableT || isDraft ? (
        <span className="brickdoc-formula-placeholder">
          <Icon.Formula className="brickdoc-formula-placeholder-icon" />
        </span>
      ) : (
        <FormulaRender t={savedVariableT} formulaType={formulaType} />
      )

    return (
      <BlockContainer inline={true}>
        <FormulaMenu
          rootId={rootId}
          formulaId={formulaId}
          doCalculate={doCalculate}
          formulaResult={formulaResult}
          editorContent={editorContent}
          defaultVisible={defaultVisible}
          onVisibleChange={handleDefaultPopoverVisibleChange}
          isDisableSave={isDisableSave}
          doHandleSave={doHandleSave}
          variableT={variableT}
          defaultName={defaultName}
          name={name}
          handleDelete={handleDelete}>
          {renderData}
        </FormulaMenu>
      </BlockContainer>
    )
  }


  const editor = (
    <FormulaEditor
      editorContent={editorContent}
      editable={true}
      onBlur={onEditorBlur}
      formulaId={formulaId}
      rootId={rootId}
    />
  )

  if (!completion.completions.length && (!variableT || variableT.kind === 'literal')) {
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
