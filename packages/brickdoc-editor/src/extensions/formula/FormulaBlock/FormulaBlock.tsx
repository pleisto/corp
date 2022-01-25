/* eslint-disable no-nested-ternary */
import React from 'react'
import { NodeViewProps } from '@tiptap/core'
import { Modal } from '@brickdoc/design-system'
import { VariableData, VariableInterface } from '@brickdoc/formula'
import { useEditorI18n } from '../../../hooks'
import { EditorDataSourceContext } from '../../../dataSource/DataSource'
import { FormulaBlockRender } from '../../../components/Formula/FormulaBlockRender'

export interface FormulaBlockProps extends NodeViewProps {}

const i18nKey = 'formula.menu'

export const FormulaBlock: React.FC<FormulaBlockProps> = ({ editor, node, updateAttributes, extension, getPos }) => {
  const { t } = useEditorI18n()
  const isNew = node.attrs.isNew
  const formulaId = node.attrs.uuid
  const editorDataSource = React.useContext(EditorDataSourceContext)
  const rootId = editorDataSource.rootId
  const formulaContext = editorDataSource.formulaContext

  const updateFormula = React.useCallback((variable: VariableInterface | undefined): void => {}, [])

  const handleDelete = React.useCallback(
    (variableT?: VariableData): void => {
      Modal.confirm({
        zIndex: 1070,
        title: t(`${i18nKey}.delete_confirm.title`),
        okText: t(`${i18nKey}.delete_confirm.ok`),
        okButtonProps: { danger: true },
        cancelText: t(`${i18nKey}.delete_confirm.cancel`),
        icon: null,
        onOk: async () => {
          if (!variableT || !getPos || !node || !formulaContext) return
          const position = getPos()
          void (await formulaContext?.removeVariable(variableT.namespaceId, variableT.variableId))
          editor.commands.deleteRange({ from: position, to: position + node.nodeSize })
        }
      })
    },
    [editor.commands, formulaContext, getPos, node, t]
  )

  const handleTurnOffVisible = React.useCallback(() => updateAttributes({ isNew: false }), [updateAttributes])

  return (
    <FormulaBlockRender
      defaultVisible={isNew}
      handleTurnOffVisible={handleTurnOffVisible}
      handleDelete={handleDelete}
      rootId={rootId}
      formulaId={formulaId}
      updateFormula={updateFormula}
      formulaType="normal"
    />
  )
}
