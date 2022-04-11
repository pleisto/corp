import { FC, ReactElement } from 'react'
import { resultToColorType, VariableDisplayData } from '@brickdoc/formula'
import './Formula.less'
import { css, cx, Icon, Tooltip } from '@brickdoc/design-system'
import { SelectedType } from '../../blockViews/FormulaView'
import { FORMULA_COLOR_METAS, FORMULA_ICONS } from './color'

export interface FormulaValueProps {
  displayData: VariableDisplayData
  display: string
  border?: boolean
  name?: string
  disablePopover?: boolean
  selected?: SelectedType
}

export const FormulaValue: FC<FormulaValueProps> = ({
  name,
  border,
  selected,
  display,
  disablePopover,
  displayData: { result, type }
}) => {
  const colorType = resultToColorType(result)
  const { colorMain, color1, color2, color3, colorCode } = FORMULA_COLOR_METAS[colorType]
  const icon = FORMULA_ICONS[colorType]
  const hasBorder = type === 'normal' && border

  if (!hasBorder) {
    return (
      <span className="brickdoc-formula-borderless" style={{ color: colorCode, fontFamily: 'Fira Code' }}>
        {display}
      </span>
    )
  }

  const formulaStyle = css({
    color: colorMain,
    fontFamily: 'Fira Code',
    backgroundColor: color1,
    border: '1px solid',
    borderColor: selected ? colorMain : color1,
    '&:hover': {
      color: colorMain,
      borderColor: color2,
      backgroundColor: color2
    },
    '&:focus, &:active': {
      color: colorMain,
      borderColor: color3,
      backgroundColor: color3
    }
  })

  // eslint-disable-next-line no-nested-ternary
  const finalDisplay = result.type === 'boolean' ? (result.result ? '✓' : '✗') : display

  let data: ReactElement

  switch (result.type) {
    case 'Error':
      data = (
        <span className={cx(formulaStyle(), 'brickdoc-formula-error')}>
          <Icon.Formula className="brickdoc-formula-error-icon" />
        </span>
      )
      break
    case 'Waiting':
    case 'Pending':
      data = (
        <span className={cx(formulaStyle(), 'brickdoc-formula-pending')}>
          <Icon.Formula className="brickdoc-formula-pending-icon" />
        </span>
      )
      break
    default:
      data = (
        <span className={cx(formulaStyle(), 'brickdoc-formula-normal')}>
          <span className="brickdoc-formula-normal-icon">{icon}</span>
          <span className="brickdoc-formula-normal-display">{finalDisplay}</span>
        </span>
      )
      break
  }

  if (disablePopover ?? !name) {
    return data
  }

  const title = result.type === 'Error' ? `${name}: ${result.result}` : name

  return (
    <Tooltip title={title} destroyTooltipOnHide={true}>
      {data}
    </Tooltip>
  )
}
