import { HTMLAttributes, FC } from 'react'
import { styled, theme, CSS } from '../../themes'

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'css'> {
  css?: CSS
}

/**
 * @see https://www.w3.org/WAI/tutorials/forms/labels/#note-on-hiding-elements
 */
const DividerTextWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  fontSize: '1em',
  fontWeight: 'normal',
  color: theme.colors.typeThirdary,
  marginY: '1em',
  '&::before, &::after': {
    content: '',
    flex: 1,
    borderBottom: `1px solid ${theme.colors.dividerPrimary}`
  },
  '& > span': {
    marginX: '0.5em',
    color: 'inherit'
  }
})

const Hr = styled('hr', {
  margin: '0.5em 0',
  border: 'none',
  borderTop: `1px solid ${theme.colors.dividerPrimary}`
})

export const Divider: FC<DividerProps> = ({ children, ...props }) =>
  children ? (
    <DividerTextWrapper {...props}>
      <span>{children}</span>
    </DividerTextWrapper>
  ) : (
    <Hr {...props} />
  )
