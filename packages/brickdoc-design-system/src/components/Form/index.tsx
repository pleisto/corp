import { forwardRef } from 'react'
import { SubmitHandler, FieldValues, SubmitErrorHandler, UseFormReturn, Controller } from 'react-hook-form'
import { useForm } from './hook'
import { FormField, FormFieldProps } from './FormField'
import { FormProvider, useFormContext } from './context'
import { FormControlProps, FormControl } from './FormControl'
import type { CSS } from '@stitches/react'
import { styled, config } from '../../themes'

const StyledForm = styled('form')

export interface FormProps<TFieldValues> {
  form: UseFormReturn<TFieldValues | any>
  onSubmit?: SubmitHandler<TFieldValues>
  onError?: SubmitErrorHandler<TFieldValues>
  layout?: FormControlProps['layout']
  children: React.ReactNode
  css?: CSS<typeof config>
  className?: string
}

/**
 * @see https://react-hook-form.com/advanced-usage#SmartFormComponent
 * @param props
 * @returns
 */
const FormFC = forwardRef(<T extends FieldValues>(props: FormProps<T>, ref: React.Ref<HTMLFormElement>) => {
  const { css, onError, onSubmit, children, layout, form, className } = props
  return (
    <FormProvider {...form} layout={layout}>
      <StyledForm
        ref={ref}
        css={css as any}
        className={className}
        onSubmit={onSubmit ? form.handleSubmit(onSubmit, onError) : undefined}>
        {children}
      </StyledForm>
    </FormProvider>
  )
})

const Form = Object.assign(FormFC, {
  Field: FormField,
  Controller,
  useForm
})

export type { FormControlProps, FormFieldProps, SubmitHandler, SubmitErrorHandler }
export { Form, useFormContext, FormControl }
