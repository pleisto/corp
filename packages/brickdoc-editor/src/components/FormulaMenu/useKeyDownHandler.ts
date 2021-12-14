import React from 'react'
import { Completion } from '@brickdoc/formula'
import { KeyDownHandlerType } from '../../extensions/formula/FormulaEditor/extensions/handleKeyDown'
import { JSONContent } from '@tiptap/core'

export function useKeydownHandler({
  activeCompletion,
  completions,
  content,
  activeCompletionIndex,
  setActiveCompletion,
  setActiveCompletionIndex,
  handleSelectActiveCompletion
}: {
  activeCompletion: Completion | undefined
  content: JSONContent | undefined
  completions: Completion[]
  activeCompletionIndex: number
  handleSelectActiveCompletion: (completion?: Completion, content?: JSONContent) => void
  setActiveCompletion: React.Dispatch<React.SetStateAction<Completion | undefined>>
  setActiveCompletionIndex: React.Dispatch<React.SetStateAction<number>>
}): KeyDownHandlerType {
  const latestCompletion = React.useRef(activeCompletion)
  React.useEffect(() => {
    latestCompletion.current = activeCompletion
  }, [activeCompletion])

  const latestContent = React.useRef(content)
  React.useEffect(() => {
    latestContent.current = content
  }, [content])

  const keyDownHandler = React.useCallback(
    (view, event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        return true
      }

      let newIndex: number
      switch (event.key) {
        case 'Tab':
          handleSelectActiveCompletion(latestCompletion.current, latestContent.current)
          return true
        case 'ArrowDown':
          newIndex = activeCompletionIndex + 1 > completions.length - 1 ? 0 : activeCompletionIndex + 1
          setActiveCompletion(completions[newIndex])
          setActiveCompletionIndex(newIndex)
          return true
        case 'ArrowUp':
          newIndex = activeCompletionIndex - 1 < 0 ? completions.length - 1 : activeCompletionIndex - 1
          setActiveCompletion(completions[newIndex])
          setActiveCompletionIndex(newIndex)
          return true
      }

      return false
    },
    [handleSelectActiveCompletion, activeCompletionIndex, completions, setActiveCompletion, setActiveCompletionIndex]
  )

  return keyDownHandler
}
