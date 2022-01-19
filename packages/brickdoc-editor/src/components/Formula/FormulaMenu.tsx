import React from 'react'
import { Button, Input, Popover } from '@brickdoc/design-system'
import {
  buildVariable,
  CodeFragment,
  Completion,
  ContextInterface,
  displayValue,
  ErrorMessage,
  FormulaSourceType,
  interpret,
  InterpretResult,
  parse,
  ParseResult,
  VariableInterface
} from '@brickdoc/formula'
import { useEditorI18n } from '../../hooks'
import './FormulaMenu.less'
import { JSONContent } from '@tiptap/core'
import { AutocompleteList } from './AutocompleteList/AutocompleteList'
import { FormulaEditor } from '../../extensions/formula/FormulaEditor/FormulaEditor'
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
} from '../../helpers/formula'
import { EditorDataSourceContext } from '../../dataSource/DataSource'
import { BrickdocEventBus, FormulaEditorUpdateEventTrigger, FormulaKeyboardEventTrigger } from '@brickdoc/schema'

export interface FormulaMenuProps {
  defaultVisible: boolean
  formulaId: string
  formulaName?: string
  formulaType: FormulaSourceType
  rootId: string
  onVisibleChange: (visible: boolean) => void
  variable?: VariableInterface
  updateVariable: React.Dispatch<React.SetStateAction<VariableInterface | undefined>>
  updateFormula: (variable: VariableInterface) => void
  handleDelete: (variable: VariableInterface) => void
}

const i18nKey = 'formula.menu'

const calculate = async ({
  namespaceId,
  variable,
  formulaId,
  name,
  input,
  position,
  formulaType,
  formulaContext
}: {
  namespaceId: string
  formulaId: string
  variable: VariableInterface | undefined
  formulaType: FormulaSourceType
  name: string
  input: string
  position: number
  formulaContext: ContextInterface
}): Promise<{
  completions: Completion[]
  newVariable: VariableInterface
  errors: ErrorMessage[]
  newPosition: number
  parseResult: ParseResult
  interpretResult: InterpretResult
}> => {
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
export type CodeFragmentWithBlockId = CodeFragment & { blockId: string }

export const FormulaMenu: React.FC<FormulaMenuProps> = ({
  children,
  rootId,
  formulaId,
  formulaName,
  formulaType,
  defaultVisible,
  onVisibleChange,
  variable,
  updateFormula,
  updateVariable,
  handleDelete
}) => {
  const { t } = useEditorI18n()
  const editorDataSource = React.useContext(EditorDataSourceContext)
  const formulaContext = editorDataSource.formulaContext
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
  const [visible, setVisible] = React.useState(defaultVisible)
  const [content, setContent] = React.useState<JSONContent | undefined>(defaultContent)
  const [activeCompletion, setActiveCompletion] = React.useState<Completion | undefined>(completions[0])
  const [activeCompletionIndex, setActiveCompletionIndex] = React.useState<number>(0)

  const [position, setPosition] = React.useState(0)

  const doCalculate = React.useCallback(
    async ({ newName, newInput }: { newName?: string; newInput?: string }): Promise<void> => {
      if (!formulaContext || !(newInput ?? input)) {
        console.log('no final input!')
        return
      }

      const finalName = newName ?? name ?? defaultName
      const finalInput = newInput ?? input ?? ''
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
    },
    [
      defaultName,
      formulaContext,
      formulaId,
      formulaIsNormal,
      formulaType,
      input,
      name,
      position,
      rootId,
      updateVariable,
      variable
    ]
  )

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
    void doCalculate({ newInput: finalInputAfterEqual })
  }, [activeCompletion, content, doCalculate, formulaIsNormal, position])

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
          void handleSave()
          break
      }
    })
    return () => listener.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCompletionIndex, completions])

  React.useEffect(() => {
    const listener = BrickdocEventBus.subscribe(FormulaEditorUpdateEventTrigger, event => {
      console.log('update subscribe', { event })

      setPosition(event.payload.position)
      handleValueChange(event.payload.input)
    })
    return () => listener.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleValueChange = (text: string): void => {
    const value = formulaIsNormal ? `=${text}` : text
    setInput(value)
    void doCalculate({ newInput: value })
  }

  const close = (): void => {
    setVisible(false)
    onVisibleChange?.(false)
  }

  const onPopoverVisibleChange = (visible: boolean): void => {
    onVisibleChange?.(visible)

    if (!visible) {
      close()
      return
    }
    setVisible(visible)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value)
    void doCalculate({ newName: e.target.value })
  }

  const isDisableSave = (): boolean => {
    if (!(name ?? defaultName) || !input || !variable) return true
    if (!formulaContext) return true

    if (error && ['name_unique', 'name_check', 'fatal'].includes(error.type)) return true

    return false
  }

  const handleSave = async (): Promise<void> => {
    if (isDisableSave()) return
    const finalName = name ?? defaultName

    variable!.t.name = finalName
    variable!.t.definition = input!
    updateFormula(variable!)

    await variable!.save()
    setName(finalName)
    updateVariable(variable)

    console.log('save ...', { input, variable, updateVariable, formulaContext })
    close()
  }

  const handleCancel = (): void => {
    close()
  }

  const result = (
    <>
      <div className="formula-menu-result">
        {error && (
          <span className="formula-menu-result-error">
            <span className="formula-menu-result-error-type">{error.type}</span>
            <span className="formula-menu-result-error-message">{error.message}</span>
          </span>
        )}
        {!error && variable && displayValue(variable.t.variableValue.result)}
      </div>
      <div className="formula-menu-divider" />
      <AutocompleteList
        blockId={rootId}
        completions={completions}
        handleSelectActiveCompletion={handleSelectActiveCompletion}
        setActiveCompletion={setActiveCompletion}
        activeCompletionIndex={activeCompletionIndex}
        setActiveCompletionIndex={setActiveCompletionIndex}
        activeCompletion={activeCompletion}
      />
    </>
  )

  const menu = (
    <div className="brickdoc-formula-menu">
      <div className="formula-menu-header">{t(`${i18nKey}.header`)}</div>
      {formulaIsNormal && (
        <div className="formula-menu-row">
          <div className="formula-menu-item">
            <label className="formula-menu-label">
              <span className="formula-menu-label-text">{t(`${i18nKey}.name`)}</span>
              <Input
                className="formula-menu-field"
                placeholder={defaultName}
                value={name}
                onChange={handleNameChange}
              />
            </label>
          </div>
        </div>
      )}
      <div className="formula-menu-row">
        {formulaIsNormal && <span className="formula-menu-result-label">=</span>}
        <div className="formula-menu-item">
          <FormulaEditor content={content} position={position} editable={true} />
        </div>
      </div>
      <div className="formula-menu-divider" />
      {result}
      <div className="formula-menu-footer">
        <Button className="formula-menu-button" size="small" type="text" onClick={handleCancel}>
          {t(`${i18nKey}.cancel`)}
        </Button>
        <Button
          className="formula-menu-button"
          size="small"
          type="primary"
          onClick={handleSave}
          disabled={isDisableSave()}>
          {t(`${i18nKey}.save`)}
        </Button>
        <Button
          className="formula-menu-button"
          size="small"
          type="text"
          danger={true}
          onClick={() => handleDelete(variable!)}>
          {t(`${i18nKey}.delete`)}
        </Button>
      </div>
    </div>
  )

  // const menuContent = formulaIsNormal ? menu : result
  const menuContent = menu

  return (
    <Popover
      onVisibleChange={onPopoverVisibleChange}
      defaultVisible={defaultVisible}
      visible={visible}
      overlayClassName="brickdoc-formula-menu-popover"
      destroyTooltipOnHide={true}
      content={menuContent}
      placement="bottom"
      trigger={['click']}>
      {children}
    </Popover>
  )
}
