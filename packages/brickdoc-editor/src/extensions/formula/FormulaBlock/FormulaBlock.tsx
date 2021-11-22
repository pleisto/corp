/* eslint-disable no-nested-ternary */
import React from 'react'
import { NodeViewProps } from '@tiptap/core'
import { Dropdown, Icon, Menu, Modal } from '@brickdoc/design-system'
import { BlockWrapper } from '../../BlockWrapper'
import { FormulaMenu } from '../../../components'
import { useEditorI18n } from '../../..'
import { COLOR } from '../../helpers/color'
import './FormulaBlock.less'
import { FormulaOptions } from '..'

export interface FormulaBlockProps extends NodeViewProps {}

export const FormulaBlock: React.FC<FormulaBlockProps> = ({ editor, node, updateAttributes, extension, getPos }) => {
  const [t] = useEditorI18n()
  const { getVariable }: FormulaOptions['formulaContextActions'] = extension.options.formulaContextActions
  const attributes = node.attrs.formula
  const variable = getVariable(attributes.id)
  const [variableT, setVariableT] = React.useState(variable?.t)

  React.useEffect(() => {
    setVariableT(variable?.t)
    variable?.onUpdate(t => {
      setVariableT(t)
    })
  }, [variable])

  const updateFormula = (id: string, color: string): void =>
    updateAttributes({
      formula: {
        type: 'FORMULA',
        id,
        color
      }
    })

  const handleDelete = (): void => {
    Modal.confirm({
      title: t('formula.block.menu.delete_confirm.title'),
      okText: t('formula.block.menu.delete_confirm.ok'),
      okButtonProps: {
        danger: true
      },
      cancelText: t('formula.block.menu.delete_confirm.cancel'),
      icon: null,
      onOk: async () => {
        if (!variableT) return
        const position = getPos()
        const { removeVariable }: FormulaOptions['formulaContextActions'] = extension.options.formulaContextActions
        removeVariable(variableT.variableId)
        editor.commands.deleteRange({ from: position, to: position + node.nodeSize })
      }
    })
  }

  const menu = (
    <Menu className="formula-block-menu">
      <FormulaMenu
        mode="create"
        variableId={variableT?.variableId}
        editor={editor}
        formulaName={variableT?.name}
        formulaValue={
          variableT?.codeFragments ? `=${variableT.codeFragments.map(fragment => fragment.name).join(' ')}` : variableT?.definition
        }
        formulaColor={attributes.color}
        formulaResult={variableT?.variableValue.value}
        formulaContextActions={extension.options.formulaContextActions}
        updateFormula={updateFormula}>
        <Menu.Item className="formula-block-menu-item" key="Edit">
          {t('formula.block.menu.edit')}
        </Menu.Item>
      </FormulaMenu>
      {/* <Menu.Item className="formula-block-menu-item" key="Copy">
        {t('formula.block.menu.copy')}
      </Menu.Item> */}
      <Menu.Item onClick={handleDelete} className="formula-block-menu-item" key="Delete">
        {t('formula.block.menu.delete')}
      </Menu.Item>
    </Menu>
  )

  const activeColor = React.useMemo(() => COLOR.find(item => item.color === attributes.color) ?? COLOR[0], [attributes.color])

  return (
    <BlockWrapper as="span" editor={editor}>
      <Dropdown overlay={menu} trigger={['click']}>
        {variableT ? (
          <span
            className="brickdoc-formula"
            style={{
              color: activeColor.color,
              borderColor: `rgb(${activeColor.rgb.join(',')}, 0.3)`,
              background: activeColor.label === 'Default' ? 'unset' : `rgb(${activeColor.rgb.join(',')}, 0.1)`
            }}>
            {variableT?.name}:{' '}
            {variableT.variableValue.success
              ? variableT.variableValue.type === 'string'
                ? `"${variableT.variableValue.value}"`
                : String(variableT.variableValue.value)
              : variableT.variableValue.errorMessages[0].message}
          </span>
        ) : (
          <span className="brickdoc-formula-placeholder">
            <Icon.Formula className="brickdoc-formula-placeholder-icon" />
          </span>
        )}
      </Dropdown>
    </BlockWrapper>
  )
}
