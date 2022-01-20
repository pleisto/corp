import {
  buildVariable,
  Completion,
  ContextInterface,
  ErrorMessage,
  FormulaSourceType,
  interpret,
  InterpretResult,
  parse,
  ParseResult,
  VariableInterface
} from '@brickdoc/formula'
import { BrickdocEventBus, FormulaEditorUpdateEventTrigger, FormulaKeyboardEventTrigger } from '@brickdoc/schema'
import { JSONContent } from '@tiptap/core'
import React from 'react'
import {
  attrsToJSONContent,
  buildJSONContentByArray,
  buildJSONContentByDefinition,
  codeFragmentsToJSONContentTotal,
  codeFragmentToJSONContentArray,
  contentArrayToInput,
  fetchJSONContentArray,
  maybeRemoveCodeFragmentsEqual,
  maybeRemoveDefinitionEqual,
  positionBasedContentArrayToInput
} from '../../helpers'

export interface UseFormulaInput {
  rootId: string
  formulaId: string
  formulaName?: string
  formulaContext: ContextInterface | null | undefined
  updateFormula: (variable: VariableInterface) => void
  formulaType: FormulaSourceType
  variable: VariableInterface | undefined
  updateVariable: React.Dispatch<React.SetStateAction<VariableInterface | undefined>>
}

export interface UseFormulaOutput {
  doCalculate: () => Promise<void>
  setName: (name: string) => void
  name: string | undefined
  error: ErrorMessage | undefined
  defaultName: string
  formulaIsNormal: boolean
  content: JSONContent | undefined
  position: number
  isDisableSave: () => boolean
  doHandleSave: () => Promise<void>
  completions: Completion[]
  handleSelectActiveCompletion: () => void
  setActiveCompletion: (completion: Completion) => void
  activeCompletionIndex: number
  setActiveCompletionIndex: (index: number) => void
  activeCompletion: Completion | undefined
}

export interface CalculateInput {
  namespaceId: string
  formulaId: string
  variable: VariableInterface | undefined
  formulaType: FormulaSourceType
  name: string
  input: string
  position: number
  formulaContext: ContextInterface
}

export interface CalculateOutput {
  completions: Completion[]
  newVariable: VariableInterface
  errors: ErrorMessage[]
  newPosition: number
  parseResult: ParseResult
  interpretResult: InterpretResult
}

const calculate = async ({
  namespaceId,
  variable,
  formulaId,
  name,
  input,
  position,
  formulaType,
  formulaContext
}: CalculateInput): Promise<CalculateOutput> => {
  const variableId = variable ? variable.t.variableId : formulaId
  const meta = { namespaceId, variableId, name, input, type: formulaType }
  const ctx = {
    formulaContext,
    meta,
    interpretContext: { ctx: {}, arguments: [] }
  }
  const parseResult = parse({ ctx, position })

  console.log('calculate', {
    ctx,
    parseResult,
    input,
    position,
    newPosition: parseResult.position,
    lastChar: input[position - 1],
    nextChar: input[position],
    newInput: parseResult.input,
    codeFragments: parseResult.codeFragments
  })

  const completions = parseResult.completions

  let interpretResult: InterpretResult

  if (parseResult.success) {
    interpretResult = await interpret({ parseResult, ctx })
  } else {
    interpretResult = {
      lazy: false,
      variableValue: {
        success: false,
        result: {
          type: 'Error',
          result: parseResult.errorMessages[0].message,
          errorKind: parseResult.errorMessages[0].type
        },
        cacheValue: {
          type: 'Error',
          result: parseResult.errorMessages[0].message,
          errorKind: parseResult.errorMessages[0].type
        },
        updatedAt: new Date()
      }
    }
  }

  const newVariable = buildVariable({ formulaContext, meta, parseResult, interpretResult })

  return {
    newPosition: parseResult.position,
    completions,
    newVariable,
    errors: parseResult.errorMessages,
    parseResult,
    interpretResult
  }
}

export const useFormula = ({
  rootId,
  formulaId,
  formulaContext,
  updateFormula,
  formulaType,
  variable,
  updateVariable,
  formulaName
}: UseFormulaInput): UseFormulaOutput => {
  const formulaIsNormal = formulaType === 'normal'

  const contextDefaultName = formulaContext ? formulaContext.getDefaultVariableName(rootId, 'any') : ''

  const formulaValue = variable?.t.valid
    ? variable.t.codeFragments.map(fragment => fragment.name).join('')
    : variable?.t.definition
  const realDefinition = maybeRemoveDefinitionEqual(formulaValue, formulaIsNormal)

  const oldCodeFragments = maybeRemoveCodeFragmentsEqual(variable?.t.codeFragments, formulaIsNormal)
  const defaultContent = variable?.t.valid
    ? codeFragmentsToJSONContentTotal(oldCodeFragments)
    : buildJSONContentByDefinition(realDefinition)

  const contextCompletions =
    formulaContext && (formulaIsNormal || formulaValue?.startsWith('='))
      ? formulaContext.completions(rootId, variable?.t.variableId)
      : []

  const [completions, setCompletions] = React.useState(contextCompletions)

  const [name, setName] = React.useState(formulaName ?? variable?.t.name)
  const [defaultName, setDefaultName] = React.useState(contextDefaultName)
  const [input, setInput] = React.useState(formulaValue)

  const [error, setError] = React.useState<ErrorMessage | undefined>()
  const [content, setContent] = React.useState<JSONContent | undefined>(defaultContent)
  const [activeCompletion, setActiveCompletion] = React.useState<Completion | undefined>(completions[0])
  const [activeCompletionIndex, setActiveCompletionIndex] = React.useState<number>(0)

  const [position, setPosition] = React.useState(0)

  const doCalculate = React.useCallback(async (): Promise<void> => {
    if (!formulaContext || !input) {
      console.log('no final input!')
      return
    }

    const finalName = name ?? defaultName
    const finalInput = input ?? ''
    const inputIsEmpty = ['', '='].includes(finalInput.trim())

    const result = await calculate({
      namespaceId: rootId,
      formulaId,
      variable,
      formulaType,
      position,
      name: finalName,
      input: finalInput,
      formulaContext
    })

    if (!result) return

    const { interpretResult, newPosition, parseResult, completions, newVariable, errors } = result

    // console.log('calculate result', {
    //   finalName,
    //   newName,
    //   newInput,
    //   input,
    //   finalInput,
    //   parseResult,
    //   activeCompletion,
    //   latestPosition: latestPosition.current,
    //   position,
    //   newPosition,
    //   result,
    //   latestActiveCompletion: latestActiveCompletion.current
    // })

    setCompletions(completions)
    setActiveCompletion(completions[0])
    setPosition(newPosition)

    if (parseResult.valid || inputIsEmpty) {
      const codeFragments = maybeRemoveCodeFragmentsEqual(parseResult.codeFragments, formulaIsNormal)
      setContent(codeFragmentsToJSONContentTotal(codeFragments))
      setInput(parseResult.codeFragments.map(fragment => fragment.name).join(''))
    }

    if (inputIsEmpty) {
      updateVariable(undefined)
      setError(undefined)
    } else {
      updateVariable(newVariable)
      setError(errors.length ? errors[0] : undefined)
    }

    if (interpretResult.variableValue.success) {
      const type = interpretResult.variableValue.result.type
      setDefaultName(formulaContext.getDefaultVariableName(rootId, type))
    }
  }, [
    defaultName,
    formulaContext,
    formulaId,
    formulaIsNormal,
    formulaType,
    input,
    name,
    position,
    setContent,
    setActiveCompletion,
    setCompletions,
    setPosition,
    setInput,
    rootId,
    updateVariable,
    variable
  ])

  const handleSelectActiveCompletion = React.useCallback((): void => {
    const currentCompletion = activeCompletion
    const currentContent = content

    if (!currentCompletion) {
      console.error('No active completion!')
      return
    }

    let oldContent = fetchJSONContentArray(currentContent)
    let positionChange: number = currentCompletion.positionChange
    const oldContentLast = oldContent[oldContent.length - 1]
    const { prevText, nextText } = positionBasedContentArrayToInput(oldContent, position)

    // console.log('Before replace', {
    //   oldContentLast,
    //   oldContent,
    //   prevText,
    //   currentPosition: latestPosition.current,
    //   position,
    //   nextText,
    //   positionChange,
    //   currentCompletion
    // })

    if (oldContentLast && prevText && currentCompletion.replacements.length) {
      // console.log('start replace', {
      //   oldContentLast,
      //   currentCompletion,
      //   currentContent,
      //   prevText,
      //   position,
      //   nextText,
      //   currentPosition: latestPosition.current
      // })
      if (currentCompletion.replacements.includes(prevText)) {
        positionChange -= prevText.length
        oldContent = []
      } else {
        const replacement = currentCompletion.replacements.find(replacement => prevText.endsWith(replacement))
        if (!replacement) {
          console.info('replacement not found 1', { prevText, currentCompletion, nextText })
        } else {
          positionChange = positionChange - prevText.length + (replacement.length as number)
          const newText = prevText.substring(0, prevText.length - replacement.length)
          oldContent = [
            attrsToJSONContent({
              display: () => newText,
              value: newText,
              code: 'ANY',
              type: 'any',
              error: '',
              hidden: false
            })
          ]
        }
      }
    }

    const nextContents = nextText
      ? [
          attrsToJSONContent({
            display: () => nextText,
            value: nextText,
            code: 'ANY',
            type: 'any',
            error: '',
            hidden: false
          })
        ]
      : []

    const completionContents: JSONContent[] = codeFragmentToJSONContentArray(currentCompletion.codeFragment)
    const newContent: JSONContent[] = [...oldContent, ...completionContents, ...nextContents]
    const finalContent = buildJSONContentByArray(newContent)
    const finalInput = contentArrayToInput(fetchJSONContentArray(finalContent))
    const finalInputAfterEqual = formulaIsNormal ? `=${finalInput}` : finalInput
    const newPosition = position + positionChange

    setContent(finalContent)
    setPosition(newPosition)
    setInput(finalInputAfterEqual)

    console.log('selectCompletion', {
      finalContent,
      currentCompletion,
      newPosition,
      content,
      newContent,
      finalInput,
      finalInputAfterEqual
    })
    void doCalculate()
  }, [activeCompletion, content, setContent, setPosition, setInput, doCalculate, formulaIsNormal, position])

  const handleEditorUpdate = React.useCallback(
    ({ input: newInput, position: newPosition }: { input: string; position: number }): void => {
      const value = formulaIsNormal ? `=${newInput}` : newInput
      setPosition(newPosition)
      setInput(value)
      console.log({ value, input, debug: value === input })
      void doCalculate()
    },
    [doCalculate, formulaIsNormal, setInput, setPosition, input]
  )

  const isDisableSave = React.useCallback((): boolean => {
    if (!formulaContext) return true
    if (!variable) return true
    if (!(name ?? defaultName)) return true
    if (!input) return true
    if (error && ['name_unique', 'name_check', 'fatal'].includes(error.type)) return true

    return false
  }, [defaultName, error, formulaContext, input, name, variable])

  const doHandleSave = React.useCallback(async (): Promise<void> => {
    if (isDisableSave()) return
    const finalName = name ?? defaultName

    variable!.t.name = finalName
    variable!.t.definition = input!
    updateFormula(variable!)

    await variable!.save()
    setName(finalName)
    updateVariable(variable)

    console.log('save ...', { input, variable, updateVariable, formulaContext })
  }, [defaultName, isDisableSave, formulaContext, input, name, updateFormula, updateVariable, variable])

  React.useEffect(() => {
    const listener = BrickdocEventBus.subscribe(FormulaKeyboardEventTrigger, event => {
      let newIndex: number
      switch (event.payload.key) {
        case 'ArrowUp':
          newIndex = activeCompletionIndex - 1 < 0 ? completions.length - 1 : activeCompletionIndex - 1
          setActiveCompletion(completions[newIndex])
          setActiveCompletionIndex(newIndex)
          break
        case 'ArrowDown':
          newIndex = activeCompletionIndex + 1 > completions.length - 1 ? 0 : activeCompletionIndex + 1
          setActiveCompletion(completions[newIndex])
          setActiveCompletionIndex(newIndex)
          break
        case 'Tab':
          handleSelectActiveCompletion()
          break
        case 'Enter':
          void doHandleSave()
          break
      }
    })
    return () => listener.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCompletionIndex, completions])

  React.useEffect(() => {
    const listener = BrickdocEventBus.subscribe(FormulaEditorUpdateEventTrigger, event => {
      console.log('update subscribe', { event })
      handleEditorUpdate({ input: event.payload.input, position: event.payload.position })
    })
    return () => listener.unsubscribe()
  }, [handleEditorUpdate])

  return {
    doCalculate,
    setName,
    name,
    error,
    isDisableSave,
    doHandleSave,
    formulaIsNormal,
    defaultName,
    content,
    position,
    completions,
    handleSelectActiveCompletion,
    setActiveCompletion,
    activeCompletionIndex,
    setActiveCompletionIndex,
    activeCompletion
  }
}
