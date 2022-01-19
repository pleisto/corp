/* eslint-disable no-nested-ternary */
import React from 'react'
import { Icon, Tooltip } from '@brickdoc/design-system'
import { BlockContainer, FormulaMenu } from '../../../components'
import './FormulaBlock.less'
import { EditorDataSourceContext } from '../../../dataSource/DataSource'
import { VariableClass, VariableInterface, VariableData, FormulaSourceType } from '@brickdoc/formula'

import { BrickdocEventBus, FormulaUpdated } from '@brickdoc/schema'
import { FormulaRender } from '../../../components/Formula/FormulaRender'

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
  const isDraft = variable?.isDraft() === true && formulaType === 'normal'

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

  const handleDefaultPopoverVisibleChange = (visible: boolean): void => {
    if (!visible && defaultVisible) {
      handleTurnOffVisible?.()
    }
  }

  const renderEmpty = (): React.ReactNode => {
    return (
      <span className="brickdoc-formula-placeholder">
        <Icon.Formula className="brickdoc-formula-placeholder-icon" />
      </span>
    )
  }

  const menuContainer = (node: React.ReactNode): React.ReactNode => {
    return (
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
        {node}
      </FormulaMenu>
    )
  }

  if (!variableT || isDraft) {
    return <BlockContainer inline={true}>{menuContainer(renderEmpty())}</BlockContainer>
  }

  const resultData = <FormulaRender t={variableT} formulaType={formulaType} />
  const tooltipData = variableT.type === 'normal' ? <Tooltip title={variableT.name}>{resultData}</Tooltip> : resultData

  if (formulaType === 'normal') {
    return <BlockContainer inline={true}>{menuContainer(tooltipData)}</BlockContainer>
  }

  /*
<FormulaEditor
  content={content}
  keyDownHandler={keyDownHandler}
  position={latestPosition}
  updatePosition={latestSetPosition}
  updateContent={handleValueChange}
  editable={true}
/>
*/

  return <BlockContainer inline={true}>{menuContainer(tooltipData)}</BlockContainer>
}
