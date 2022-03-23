import { ForwardedRef } from 'react'

export function preserveRef<T>(ref: ForwardedRef<T>, value: T): void {
  if (!ref) return
  if (typeof ref === 'function') {
    ref(value)
  } else {
    ref.current = value
  }
}
