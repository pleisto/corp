/* eslint-disable no-nested-ternary */
import React from 'react'
import { NodeViewProps } from '@tiptap/core'
import { Icon } from '@brickdoc/design-system'
import { BlockContainer, FormulaMenu } from '../../../components'
import { COLOR } from '../../../helpers/color'
import './FormulaBlock.less'
import { EditorDataSourceContext } from '../../../dataSource/DataSource'
import { displayValue, FormulaType } from '@brickdoc/formula'
import { BrickdocEventBus, FormulaUpdated } from '@brickdoc/schema'

export interface FormulaBlockProps extends NodeViewProps {}

export const FormulaBlock: React.FC<FormulaBlockProps> = ({ editor, node, updateAttributes, extension, getPos }) => {
  const editorDataSource = React.useContext(EditorDataSourceContext)
  const formulaContext = editorDataSource.formulaContext

  const attributes = node.attrs.formula
  const [variable, setVariable] = React.useState(formulaContext?.findVariable(editorDataSource.rootId, attributes.id))
  const [t, setT] = React.useState(variable?.t)

  const updateFormula = (id: string): void => updateAttributes({ formula: { type: 'FORMULA', id } })

  // React.useEffect(() => {
  //   variable?.onUpdate(t => {
  //     setT(t.t)
  //     setVariable(t)
  //   })
  // }, [variable])

  React.useEffect(() => {
    BrickdocEventBus.subscribe(
      FormulaUpdated,
      e => {
        console.log('formulaUpdated', e.payload)
        setT(e.payload)
        setVariable(e.payload.t)
      },
      { eventId: `${editorDataSource.rootId},${attributes.id}`, subscribeId: 'formula' }
    )
  }, [attributes.id, editorDataSource.rootId])

  const COLOR_ARRAY: { [key in FormulaType]: number } = {
    Date: 6,
    Error: 3,
    Column: 6,
    Block: 6,
    Spreadsheet: 6,
    number: 0,
    null: 0,
    Predicate: 1,
    string: 4,
    boolean: 4,
    any: 6,
    Record: 6,
    Array: 6
  }

  const activeColorIndex = t ? COLOR_ARRAY[t.variableValue.result.type as FormulaType] || 0 : 0
  const activeColor = COLOR[activeColorIndex]
  const handleDefaultPopoverVisibleChange = (visible: boolean): void => {
    if (!visible && node.attrs.isNew) {
      updateAttributes({ isNew: false })
    }
  }

  return (
    <BlockContainer as="span" editor={editor}>
      <FormulaMenu
        node={node}
        getPos={getPos}
        defaultVisible={node.attrs.isNew}
        onVisibleChange={handleDefaultPopoverVisibleChange}
        editor={editor}
        updateFormula={updateFormula}
        variable={variable}
        updateVariable={setVariable}>
        {t ? (
          <span
            className="brickdoc-formula"
            style={{
              color: activeColor.color,
              borderColor: `rgb(${activeColor.rgb.join(',')}, 0.3)`,
              background: activeColor.label === 'Default' ? 'unset' : `rgb(${activeColor.rgb.join(',')}, 0.1)`
            }}>
            {t.name}: {displayValue(t.variableValue.result)}
          </span>
        ) : (
          <span className="brickdoc-formula-placeholder">
            <Icon.Formula className="brickdoc-formula-placeholder-icon" />
          </span>
        )}
      </FormulaMenu>
    </BlockContainer>
  )
}
