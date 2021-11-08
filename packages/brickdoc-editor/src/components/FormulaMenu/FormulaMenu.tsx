import React from 'react'
import { Editor } from '@tiptap/core'
import { Button, Input, Popover, Icon, Dropdown } from '@brickdoc/design-system'
import { Variable } from '@brickdoc/formula'
import { useEditorI18n } from '../../hooks'
import { COLOR, ColorMeta } from '../../extensions/helpers/color'
import './FormulaMenu.less'
import { FormulaOptions } from '../../extensions'

export interface FormulaMenuProps {
  mode?: 'create'
  variableId?: string
  editor: Editor
  updateFormula?: (id: string, color: string) => void
  formulaName?: string
  formulaValue?: string
  formulaColor?: string
  formulaResult?: any
  clear?: boolean
  formulaContextActions: FormulaOptions['formulaContextActions']
  formulaActions: FormulaOptions['formulaActions']
}

const i18nKey = 'formula.menu'

export const FormulaMenu: React.FC<FormulaMenuProps> = ({
  mode,
  variableId,
  editor,
  children,
  formulaName,
  formulaValue,
  formulaColor,
  formulaResult,
  formulaActions,
  formulaContextActions,
  updateFormula,
  clear
}) => {
  const { t } = useEditorI18n()
  const [name, setName] = React.useState(formulaName)
  const [value, setValue] = React.useState(formulaValue?.substr(1))
  const [type, setType] = React.useState('any')
  const [color, setColor] = React.useState(formulaColor ?? COLOR[0].color)
  const [result, setResult] = React.useState<any>(formulaResult)
  const [variable, setVariable] = React.useState<Variable>()
  const [error, setError] = React.useState<{ type: string; message: string }>()
  const [visible, setVisible] = React.useState(false)

  const activeColor = React.useMemo(() => COLOR.find(item => item.color === color), [color])

  const close = (): void => {
    if (clear) {
      setName('')
      setType('')
      setValue('')
      setColor(COLOR[0].color)
      setVariable(undefined)
      setError(undefined)
      setResult('')
    }
    setVisible(false)
  }

  const onPopoverVisibleChange = (visible: boolean): void => {
    if (!visible) {
      close()
      return
    }
    setVisible(visible)
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value)
    const formulaContext = formulaContextActions.getFormulaContext()
    if (!formulaContext || !name || !e.target.value) return
    formulaContextActions.calculate(variableId, name, e.target.value, formulaContext, setResult, setType, setVariable, setError, setValue)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value)
    const formulaContext = formulaContextActions.getFormulaContext()
    if (!formulaContext || !name || !value) return
    formulaContextActions.calculate(variableId, e.target.value, value, formulaContext, setResult, setType, setVariable, setError, setValue)
  }

  const handleSave = async (): Promise<void> => {
    if (!name || !value || !variable || !result) return
    const formulaContext = formulaContextActions.getFormulaContext()
    if (!formulaContext) return

    if (!variableId) {
      const { success } = await formulaActions.create({
        id: variable.t.variableId,
        name,
        definition: variable.t.definition,
        type,
        value: String(result)
      })
      if (!success) return
      formulaContext.commitVariable({ variable, isNew: true })
      if (mode === 'create') {
        updateFormula?.(variable.t.variableId, color)
      } else {
        editor.chain().setFormula(variable.t.variableId, color).focus().run()
      }
    } else {
      const { success } = await formulaActions.update({
        id: variableId,
        name,
        definition: variable.t.definition,
        type,
        value: String(result)
      })
      if (!success) return
      formulaContext.commitVariable({ variable, isNew: false })

      updateFormula?.(variableId, color)
    }

    close()
  }

  const handleCancel = (): void => {
    close()
  }

  const handleSelectColor = (color: ColorMeta) => (): void => {
    setColor(color.color)
  }

  const colorMenu = (
    <div className="formula-menu-color-list">
      <div className="formula-menu-color-heading">Colors</div>
      {COLOR.map(item => (
        <Button key={item.color} type="text" className="formula-menu-color-item" onClick={handleSelectColor(item)}>
          <span
            className="formula-menu-color-item-icon-wrapper"
            style={{
              borderColor: `rgb(${item.rgb.join(',')}, 0.3)`,
              background: item.label === 'Default' ? 'unset' : `rgb(${item.rgb.join(',')}, 0.1)`
            }}>
            <Icon.FontSize className="formula-menu-color-item-icon" style={{ color: item.color }} />
          </span>
          <span className="formula-menu-color-item-label">{item.label}</span>
        </Button>
      ))}
    </div>
  )

  const menu = (
    <div className="brickdoc-formula-menu">
      <div className="formula-menu-header">{t(`${i18nKey}.header`)}</div>
      <div className="formula-menu-row">
        <div className="formula-menu-item">
          <label className="formula-menu-label">
            <span className="formula-menu-label-text">{t(`${i18nKey}.name`)}</span>
            <Input className="formula-menu-field" value={name} onChange={handleNameChange} />
          </label>
        </div>
        <div className="formula-menu-item formula-menu-color">
          <label className="formula-menu-label">
            <span className="formula-menu-label-text">{t(`${i18nKey}.color`)}</span>
            <Dropdown overlay={colorMenu} placement="bottomCenter" trigger={['click']}>
              <Button type="default" className="formula-menu-field">
                {activeColor ? (
                  <span
                    className="formula-menu-color-item-icon-wrapper"
                    style={{
                      borderColor: `rgb(${activeColor.rgb.join(',')}, 0.3)`,
                      background: activeColor.label === 'Default' ? 'unset' : `rgb(${activeColor.rgb.join(',')}, 0.1)`
                    }}>
                    <Icon.FontSize className="formula-menu-color-item-icon" style={{ color: activeColor.color }} />
                  </span>
                ) : (
                  <span />
                )}
                <Icon.LineDown className="formula-menu-item-arrow-icon" />
              </Button>
            </Dropdown>
          </label>
        </div>
      </div>
      <div className="formula-menu-row">
        <span className="formula-menu-result-label">=</span>
        <div className="formula-menu-item">
          <Input className="formula-menu-field" value={value} onChange={handleValueChange} />
        </div>
      </div>
      <div className="formula-menu-divider" />
      <div className="formula-menu-result">
        {error && (
          <span className="formula-menu-result-error">
            <span className="formula-menu-result-error-type">{error.type}</span>
            <span className="formula-menu-result-error-message">{error.message}</span>
          </span>
        )}
        {!error && result}
      </div>
      <div className="formula-menu-footer">
        <Button className="formula-menu-button" size="small" type="text" onClick={handleCancel}>
          {t(`${i18nKey}.cancel`)}
        </Button>
        <Button className="formula-menu-button" size="small" type="primary" onClick={handleSave}>
          {t(`${i18nKey}.save`)}
        </Button>
      </div>
    </div>
  )

  return (
    <Popover
      onVisibleChange={onPopoverVisibleChange}
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
