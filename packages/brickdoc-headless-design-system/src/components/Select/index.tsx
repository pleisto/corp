import { ForwardRefRenderFunction, forwardRef, createRef } from 'react'
import StateSelect from 'react-select'
import { theme } from '../../themes'

type StateSelectProps = Parameters<typeof StateSelect>[0]
export interface SelectProps
  extends Omit<
    StateSelectProps,
    'isMulti' | 'isRtl' | 'isDisabled' | 'isFocused' | 'isSelected' | 'isClearable' | 'isLoading' | 'isSearchable'
  > {
  clearable?: boolean
  disabled?: boolean
  loading?: boolean
  searchable?: boolean
  multi?: boolean
  rtl?: boolean
  focused?: boolean
  selected?: boolean
}

type SelectRef = Parameters<typeof StateSelect>[0]['ref']

const Select: ForwardRefRenderFunction<unknown, SelectProps> = (
  {
    clearable = false,
    loading = false,
    searchable = false,
    multi = false,
    rtl = false,
    disabled = false,
    focused = false,
    selected = false,
    menuPortalTarget = document.body,
    styles,
    ...otherProps
  },
  ref
) => {
  const selectRef = (ref ?? createRef()) as SelectRef
  const selectProps = {
    isClearable: clearable,
    isLoading: loading,
    isSearchable: searchable,
    isMulti: multi,
    isRtl: rtl,
    isDisabled: disabled,
    isFocused: focused,
    isSelected: selected,
    menuPortalTarget,
    ...otherProps
  }
  return (
    <StateSelect
      {...selectProps}
      ref={selectRef}
      styles={{
        menuPortal: base => ({
          ...base,
          zIndex: theme.zIndices.dropdown as unknown as number
        }),
        ...styles
      }}
    />
  )
}

const _Select = forwardRef(Select)
_Select.displayName = 'Select'
export { _Select as Select }
