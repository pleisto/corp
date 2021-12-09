import React from 'react'
import { Completion } from '@brickdoc/formula'
import { KeyDownHandlerType } from '../../extensions/formula/FormulaEditor/extensions/handleKeyDown'

export function useKeydownHandler(
  activeCompletion: Completion | undefined,
  handleSelectActiveCompletion: (completion?: Completion) => void
): KeyDownHandlerType {
  const latestCompletion = React.useRef(activeCompletion)

  React.useEffect(() => {
    latestCompletion.current = activeCompletion
  }, [activeCompletion])

  const keyDownHandler = React.useCallback(
    (view, event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        return true
      }

      if (event.key === 'Tab') {
        handleSelectActiveCompletion(latestCompletion.current)
      }

      return false
    },
    [handleSelectActiveCompletion]
  )

  return keyDownHandler
}
