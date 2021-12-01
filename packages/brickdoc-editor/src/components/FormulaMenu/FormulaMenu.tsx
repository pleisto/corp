import React from 'react'
import { Button, Input, Modal, Popover } from '@brickdoc/design-system'
import { VariableInterface, VariableData } from '@brickdoc/formula'
import { useEditorI18n } from '../../hooks'
import './FormulaMenu.less'
import { FormulaOptions } from '../../extensions'
import { Editor } from '@tiptap/core'
import { FormulaBlockProps } from '../../extensions/formula/FormulaBlock'
import { AutocompleteList } from './AutocompleteList/AutocompleteList'

export interface FormulaMenuProps {
  getPos?: () => number
  node?: FormulaBlockProps['node']
  variableId?: string
  defaultVisible?: boolean
  onVisibleChange?: (visible: boolean) => void
  editor: Editor
  updateVariableT?: (t: VariableData) => void
  updateFormula?: (id: string) => void
  formulaName?: string
  formulaValue?: string
  formulaResult?: any
  clear?: boolean
  formulaContextActions: FormulaOptions['formulaContextActions']
}

const i18nKey = 'formula.menu'

export const FormulaMenu: React.FC<FormulaMenuProps> = ({
  getPos,
  node,
  variableId,
  children,
  defaultVisible,
  onVisibleChange,
  editor,
  updateFormula,
  formulaName,
  formulaValue,
  formulaResult,
  formulaContextActions,
  updateVariableT,
  clear
}) => {
  // TODO very dirty hack, remove this
  const rootId = (editor.view as any)?.docView?.node?.attrs?.uuid

  const { t } = useEditorI18n()
  const formulaContext = formulaContextActions.getFormulaContext()

  const contextDefaultName = formulaContext ? formulaContext.getDefaultVariableName(rootId, 'any') : ''
  const contextCompletions = formulaContext ? formulaContext.completions(rootId) : []
  const definition = formulaValue?.substr(1)

  const [completions, setCompletions] = React.useState(contextCompletions)

  const [name, setName] = React.useState(formulaName)
  const [defaultName, setDefaultName] = React.useState(contextDefaultName)
  const [value, setValue] = React.useState(definition)
  const [result, setResult] = React.useState<any>(formulaResult)
  const [variable, setVariable] = React.useState<VariableInterface>()
  const [error, setError] = React.useState<{ type: string; message: string }>()
  const [visible, setVisible] = React.useState(defaultVisible)

  const close = (): void => {
    if (clear) {
      setName(formulaName)
      setDefaultName(contextDefaultName)
      setCompletions(contextCompletions)
      setValue(definition)
      setVariable(undefined)
      setError(undefined)
      setResult('')
    }
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

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value)
    const finalName = name ?? defaultName
    if (!formulaContext || !e.target.value) return
    formulaContextActions.calculate({
      variableId,
      variable,
      name: finalName,
      input: e.target.value,
      formulaContext,
      updateResult: setResult,
      updateVariable: setVariable,
      updateError: setError,
      updateValue: setValue,
      updateCompletions: setCompletions,
      updateDefaultName: setDefaultName
    })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value)
    if (!formulaContext || !value) return
    formulaContextActions.calculate({
      variableId,
      variable,
      name: e.target.value,
      input: value,
      formulaContext,
      updateResult: setResult,
      updateVariable: setVariable,
      updateError: setError,
      updateValue: setValue,
      updateCompletions: setCompletions,
      updateDefaultName: setDefaultName
    })
  }

  const handleSave = async (): Promise<void> => {
    if (!(name ?? defaultName) || !value || !variable || !result) return
    if (!formulaContext) return

    if (updateFormula) {
      updateFormula(variable.t.variableId)
    } else {
      editor.chain().setFormula(variable.t.variableId).focus().run()
    }
    const finalName = name ?? defaultName
    variable.t.name = finalName
    await formulaContext.commitVariable({ variable })
    setName(finalName)
    updateVariableT?.(variable.t)

    close()
  }

  const handleCancel = (): void => {
    close()
  }

  const handleDelete = (): void => {
    Modal.confirm({
      title: t(`${i18nKey}.delete_confirm.title`),
      okText: t(`${i18nKey}.delete_confirm.ok`),
      okButtonProps: {
        danger: true
      },
      cancelText: t(`${i18nKey}.delete_confirm.cancel`),
      icon: null,
      onOk: async () => {
        if (!variableId || !getPos || !node) return
        const position = getPos()
        void (await formulaContextActions.removeVariable(variableId))
        editor.commands.deleteRange({ from: position, to: position + node.nodeSize })
      }
    })
  }

  const menu = (
    <div className="brickdoc-formula-menu">
      <div className="formula-menu-header">{t(`${i18nKey}.header`)}</div>
      <div className="formula-menu-row">
        <div className="formula-menu-item">
          <label className="formula-menu-label">
            <span className="formula-menu-label-text">{t(`${i18nKey}.name`)}</span>
            <Input className="formula-menu-field" placeholder={defaultName} value={name} onChange={handleNameChange} />
          </label>
        </div>
      </div>
      <div className="formula-menu-row">
        <div className="formula-menu-item">
          <Input className="formula-menu-field" value={value} onChange={handleValueChange} />
        </div>
      </div>
      <div className="formula-menu-divider" />
      <div className="formula-menu-result">
        <span className="formula-menu-result-label">=</span>
        {error && (
          <span className="formula-menu-result-error">
            <span className="formula-menu-result-error-type">{error.type}</span>
            <span className="formula-menu-result-error-message">{error.message}</span>
          </span>
        )}
        {!error && result}
      </div>
      <div className="formula-menu-divider" />
      <AutocompleteList completions={completions} />
      <div className="formula-menu-footer">
        <Button className="formula-menu-button" size="small" type="text" onClick={handleCancel}>
          {t(`${i18nKey}.cancel`)}
        </Button>
        <Button className="formula-menu-button" size="small" type="primary" onClick={handleSave}>
          {t(`${i18nKey}.save`)}
        </Button>
        {node && (
          <Button className="formula-menu-button" size="small" type="text" danger={true} onClick={handleDelete}>
            {t(`${i18nKey}.delete`)}
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <Popover
      onVisibleChange={onPopoverVisibleChange}
      defaultVisible={defaultVisible}
      visible={visible}
      overlayClassName="brickdoc-formula-menu-popover"
      destroyTooltipOnHide={true}
      content={menu}
      placement="bottom"
      trigger={['click']}>
      {children}
    </Popover>
  )
}
