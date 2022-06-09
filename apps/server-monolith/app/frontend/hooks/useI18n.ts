import { useTranslation, UseTranslationOptions, UseTranslationResponse } from 'react-i18next'

/**
 * Hook for using i18n. It's wrapper for `useTranslation` hook from `react-i18next`.
 * @param ns extra namespace to use
 * @param options
 * @returns
 */
export function useI18n(
  ns: string[] = [],
  options?: UseTranslationOptions
): UseTranslationResponse<string[], undefined> {
  return useTranslation<string[]>(['users', ...ns], options)
}
