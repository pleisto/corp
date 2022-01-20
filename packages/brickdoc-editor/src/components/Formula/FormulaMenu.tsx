import React from 'react'
import { Button, Input, Popover } from '@brickdoc/design-system'
import { displayValue, FormulaSourceType, VariableInterface } from '@brickdoc/formula'
import { useEditorI18n } from '../../hooks'
import './FormulaMenu.less'
import { AutocompleteList } from './AutocompleteList/AutocompleteList'
import { FormulaEditor } from '../../extensions/formula/FormulaEditor/FormulaEditor'
import { EditorDataSourceContext } from '../../dataSource/DataSource'
import { useFormula } from './useFormula'

export interface FormulaMenuProps {
  defaultVisible: boolean
  formulaId: string
  formulaName?: string
  formulaType: FormulaSourceType
  rootId: string
  onVisibleChange: (visible: boolean) => void
  variable?: VariableInterface
  updateVariable: React.Dispatch<React.SetStateAction<VariableInterface | undefined>>
  updateFormula: (variable: VariableInterface) => void
  handleDelete: (variable: VariableInterface) => void
}

const i18nKey = 'formula.menu'

export const FormulaMenu: React.FC<FormulaMenuProps> = ({
  children,
  rootId,
  formulaId,
  formulaName,
  formulaType,
  defaultVisible,
  onVisibleChange,
  variable,
  updateFormula,
  updateVariable,
  handleDelete
}) => {
  const { t } = useEditorI18n()
  const [visible, setVisible] = React.useState(defaultVisible)

  const editorDataSource = React.useContext(EditorDataSourceContext)
  const formulaContext = editorDataSource.formulaContext

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

  const close = (): void => {
    setVisible(false)
    onVisibleChange?.(false)
  }

  const onPopoverVisibleChange = (visible: boolean): void => {
    onVisibleChange?.(visible)

    if (!visible) {
      close()
      return
    }
    setVisible(visible)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value)
    void doCalculate()
  }

  const handleSave = async (): Promise<void> => {
    if (isDisableSave()) return
    await doHandleSave()
    close()
  }

  const handleCancel = (): void => {
    close()
  }

  const result = (
    <>
      <div className="formula-menu-result">
        {error && (
          <span className="formula-menu-result-error">
            <span className="formula-menu-result-error-type">{error.type}</span>
            <span className="formula-menu-result-error-message">{error.message}</span>
          </span>
        )}
        {!error && variable && displayValue(variable.t.variableValue.result)}
      </div>
      <div className="formula-menu-divider" />
      <AutocompleteList
        blockId={rootId}
        completions={completions}
        handleSelectActiveCompletion={handleSelectActiveCompletion}
        setActiveCompletion={setActiveCompletion}
        activeCompletionIndex={activeCompletionIndex}
        setActiveCompletionIndex={setActiveCompletionIndex}
        activeCompletion={activeCompletion}
      />
    </>
  )

  const menu = (
    <div className="brickdoc-formula-menu">
      <div className="formula-menu-header">{t(`${i18nKey}.header`)}</div>
      {formulaIsNormal && (
        <div className="formula-menu-row">
          <div className="formula-menu-item">
            <label className="formula-menu-label">
              <span className="formula-menu-label-text">{t(`${i18nKey}.name`)}</span>
              <Input
                className="formula-menu-field"
                placeholder={defaultName}
                value={name}
                onChange={handleNameChange}
              />
            </label>
          </div>
        </div>
      )}
      <div className="formula-menu-row">
        {formulaIsNormal && <span className="formula-menu-result-label">=</span>}
        <div className="formula-menu-item">
          <FormulaEditor content={content} position={position} editable={true} />
        </div>
      </div>
      <div className="formula-menu-divider" />
      {result}
      <div className="formula-menu-footer">
        <Button className="formula-menu-button" size="small" type="text" onClick={handleCancel}>
          {t(`${i18nKey}.cancel`)}
        </Button>
        <Button
          className="formula-menu-button"
          size="small"
          type="primary"
          onClick={handleSave}
          disabled={isDisableSave()}>
          {t(`${i18nKey}.save`)}
        </Button>
        <Button
          className="formula-menu-button"
          size="small"
          type="text"
          danger={true}
          onClick={() => handleDelete(variable!)}>
          {t(`${i18nKey}.delete`)}
        </Button>
      </div>
    </div>
  )

  // const menuContent = formulaIsNormal ? menu : result
  const menuContent = menu

  return (
    <Popover
      onVisibleChange={onPopoverVisibleChange}
      defaultVisible={defaultVisible}
      visible={visible}
      overlayClassName="brickdoc-formula-menu-popover"
      destroyTooltipOnHide={true}
      content={menuContent}
      placement="bottom"
      trigger={['click']}>
      {children}
    </Popover>
  )
}
