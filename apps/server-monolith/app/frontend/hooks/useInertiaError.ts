import { useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { Errors, ErrorBag } from '@inertiajs/inertia'

/**
 * Inject Inertia Error props into react-hook-form
 * @param errors Inertia error props
 * @param form useForm hook return value
 */
export const useInertiaError = (errors: Errors & ErrorBag, form: UseFormReturn<any, any>): void => {
  useEffect(() => {
    if (errors) {
      Object.entries(errors).forEach(([key, value]) =>
        (value as unknown as string[]).forEach(error =>
          form.setError(key as any, {
            type: error,
            message: error
          })
        )
      )
    }
  }, [errors, form.setError])
}
