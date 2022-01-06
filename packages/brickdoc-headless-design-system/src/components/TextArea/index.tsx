import { ForwardRefRenderFunction, createRef, forwardRef } from 'react'
import { Input, InputProps } from 'reakit'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import { css, theme } from '../../themes'
import cx from 'classnames'

export interface AutoSizeType {
  minRows?: number
  maxRows?: number
}

export interface TextAreaProps extends Omit<InputProps, 'as' | 'ref' | 'css'> {
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>
  autoSize?: boolean | AutoSizeType
}

const textareaStyle = css({
  width: '100%',
  resize: 'none',
  cursor: 'text',
  verticalAlign: 'bottom',
  color: theme.colors.typePrimary,
  borderColor: theme.colors.borderSecondary,
  backgroundColor: theme.colors.ceramicQuaternary,
  padding: '5px 12px',
  lineHeight: theme.lineHeights.body
})

const TextArea: ForwardRefRenderFunction<HTMLTextAreaElement, TextAreaProps> = (props, ref) => {
  const { autoSize = false, className, ...otherProps } = props
  const inputRef = ref ?? createRef<HTMLTextAreaElement>()
  const commonProps = {
    ...otherProps,
    ref: inputRef,
    className: cx(textareaStyle(), className)
  }

  return autoSize ? (
    <Input
      {...commonProps}
      maxRows={typeof autoSize === 'object' ? autoSize.maxRows : undefined}
      minRows={typeof autoSize === 'object' ? autoSize.minRows : undefined}
      as={TextareaAutosize}
    />
  ) : (
    <Input {...commonProps} as="textarea" />
  )
}

const _TextArea = forwardRef(TextArea)
_TextArea.displayName = 'TextArea'

export { _TextArea as TextArea }
