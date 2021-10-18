import React from 'react'
import { Editor } from '@tiptap/core'
import { Tooltip, Select, Icon, Button, Input, Popover } from '@brickdoc/design-system'
import { useEditorI18n } from '../../../hooks'
import { StyleMeta } from './BubbleMenu'

export interface FormulaMenuItemProps {
  editor: Editor
}

const FormulaStyle: StyleMeta = {
  key: 'formula',
  value: 'formula',
  label: <Icon.Formula />
}

export const FormulaMenuItem: React.FC<FormulaMenuItemProps> = ({ editor }) => {
  const { t } = useEditorI18n()
  const [name, setName] = React.useState('')
  const [value, setValue] = React.useState('')
  const [visible, setVisible] = React.useState(false)

  const onPopoverVisibleChange = (visible: boolean): void => {
    setVisible(visible)

    if (!visible) return

    const variable = editor.getAttributes('formula').variable
    setName(variable?.name ?? '')
    setValue(variable?.value ?? '')
  }

  const handleSave = (): void => {
    if (!name || !value) return

    editor.commands.setFormula(name, value)
    setVisible(false)
  }

  const menu = (
    <div className="brickdoc-bubble-formula-menu">
      <div className="bubble-menu-formula-header">{t(`bubblemenu.items.${FormulaStyle.key}.header`)}</div>
      <div className="bubble-menu-formula-row">
        <div className="bubble-menu-formula-item">
          <label className="bubble-menu-formula-label">
            <span className="bubble-menu-formula-label-text">{t(`bubblemenu.items.${FormulaStyle.key}.name`)}</span>
            <Input className="bubble-menu-formula-field" value={name} onChange={e => setName(e.target.value)} />
          </label>
        </div>
        <div className="bubble-menu-formula-item">
          <label className="bubble-menu-formula-label">
            <span className="bubble-menu-formula-label-text">{t(`bubblemenu.items.${FormulaStyle.key}.format`)}</span>
            <Select className="bubble-menu-formula-field">
              <Select.Option value="Money">Money</Select.Option>
            </Select>
          </label>
        </div>
      </div>
      <div className="bubble-menu-formula-row">
        <div className="bubble-menu-formula-item">
          <label className="bubble-menu-formula-label">
            <span className="bubble-menu-formula-label-text">{t(`bubblemenu.items.${FormulaStyle.key}.result`)}</span>
            <Input className="bubble-menu-formula-field" value={value} onChange={e => setValue(e.target.value)} />
          </label>
        </div>
      </div>
      <div className="bubble-menu-formula-footer">
        <Button size="small" type="primary" onClick={handleSave}>
          {t(`bubblemenu.items.${FormulaStyle.key}.save`)}
        </Button>
      </div>
    </div>
  )
  return (
    <Tooltip
      overlayClassName="brickdoc-bubble-menu-item-hint"
      destroyTooltipOnHide={true}
      title={
        <>
          <div className="item-hint-main">{t(`bubblemenu.items.${FormulaStyle.key}.desc`)}</div>
          {FormulaStyle.shortcutDesc && <div className="item-hint-sub">{FormulaStyle.shortcutDesc}</div>}
        </>
      }
      placement="top">
      <Popover
        onVisibleChange={onPopoverVisibleChange}
        visible={visible}
        overlayClassName="brickdoc-bubble-formula-popover"
        content={menu}
        placement="bottom"
        trigger={['click']}>
        <Button role="menuitem" type="text" className="bubble-menu-item">
          {FormulaStyle.label}
        </Button>
      </Popover>
    </Tooltip>
  )
}
