import deepEqual from 'fast-deep-equal'
import { useEffect, useState } from 'react'

/**
 * This hook will return the latest memorized value that
 * updates only when the `nextValue` is **DEEPLY DIFFERENT**.
 *
 * It extends the `useMemo` hook to allow for deep comparison.
 * @param nextValue The next value to compare and memorize.
 */
export function useDeepMemo<T>(nextValue: T, onChange?: (value: T) => void): T {
  const [latestValue, setLatestValue] = useState(nextValue)
  useEffect(() => {
    if (!deepEqual(latestValue, nextValue)) {
      setLatestValue(nextValue)
      onChange?.(nextValue)
    }
  }, [latestValue, nextValue, onChange])
  return latestValue
}
