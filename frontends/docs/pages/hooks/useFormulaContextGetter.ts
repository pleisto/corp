import { buildVariable, Completion, ContextInterface, interpret, parse, VariableInterface, View } from '@brickdoc/formula'
import { debounce } from 'lodash-es'
import React from 'react'
import { FormulaContextVar } from '../../reactiveVars'
import { DocMeta } from '../DocumentContentPage'
import { FormulaOptions } from 'packages/brickdoc-editor/src/extensions'
import { v4 as uuid } from 'uuid'

const parseVariableName = ({
  formulaContext,
  namespaceId,
  name
}: {
  formulaContext: ContextInterface
  name: string
  namespaceId: string
}): string => {
  const variable = formulaContext.findVariableByName(namespaceId, name)
  if (variable) {
    return `$${namespaceId}@${variable.t.variableId}`
  }
  const database = Object.values(formulaContext.databases)[0]
  if (!database) {
    return `$${name}`
  }
  const column = database.listColumns().find(column => column.name === name)
  if (column) {
    return `$${column.namespaceId}#${column.columnId}`
  }
  return `$${name}`
}

const transformUserInput = ({
  namespaceId,
  input,
  formulaContext
}: {
  input: string
  formulaContext: ContextInterface
  namespaceId: string
}): string => {
  const inputAfterTransformVariable = input.replace(/\$([a-zA-Z0-9_-]+)/g, (a, name): string => {
    return parseVariableName({ namespaceId, name, formulaContext })
  })
  return `=${inputAfterTransformVariable}`
}

export function useFormulaContextGetter(docMeta: DocMeta): FormulaOptions['formulaContextActions'] {
  const context = FormulaContextVar()
  const data = React.useRef(context)
  const blockId = React.useRef(docMeta.id)

  React.useEffect(() => {
    blockId.current = docMeta.id
  }, [docMeta.id])

  React.useEffect(() => {
    data.current = context
  }, [context])

  return {
    getFormulaContext: () => data.current,
    getVariable: (variableId: string) => {
      if (!blockId.current) return null
      return data.current?.findVariable(blockId.current, variableId)
    },
    removeVariable: (variableId: string) => {
      if (!blockId.current) return null
      return data.current?.removeVariable(blockId.current, variableId)
    },
    calculate: debounce(
      async ({
        variableId,
        variable,
        name,
        input,
        formulaContext,
        updateResult,
        updateVariable,
        updateCompletions,
        updateError,
        updateValue,
        updateDefaultName
      }: {
        variableId: string | undefined
        variable: VariableInterface | undefined
        name: string
        input: string
        formulaContext: ContextInterface
        updateResult: React.Dispatch<React.SetStateAction<any>>
        updateVariable: React.Dispatch<React.SetStateAction<VariableInterface | undefined>>
        updateError: React.Dispatch<
          React.SetStateAction<
            | {
                type: string
                message: string
              }
            | undefined
          >
        >
        updateValue: React.Dispatch<React.SetStateAction<string | undefined>>
        updateCompletions: React.Dispatch<React.SetStateAction<Completion[]>>
        updateDefaultName: React.Dispatch<React.SetStateAction<string>>
      }) => {
        const namespaceId = blockId.current ?? docMeta.id ?? ''
        const finalVariableId = variableId ?? (variable ? variable.t.variableId : uuid())
        const meta = { namespaceId, variableId: finalVariableId, name, input: transformUserInput({ namespaceId, input, formulaContext }) }
        const view: View = {}
        const parseInput = { formulaContext, meta }
        const parseResult = parse(parseInput)

        updateCompletions(parseResult.completions)

        if (parseResult.success) {
          const interpretResult = await interpret({ cst: parseResult.cst, formulaContext, meta })

          if (interpretResult.success) {
            const newInput = parseResult.codeFragments.map(fragment => fragment.name).join('')
            const variable = buildVariable({ formulaContext, meta, parseResult, interpretResult, view })
            updateVariable(variable)
            updateValue(newInput)
            updateError(undefined)
            updateResult(interpretResult.result.display)
            const type = interpretResult.result.type
            const defaultName = formulaContext.getDefaultVariableName(namespaceId, type)
            updateDefaultName(defaultName)
          } else {
            updateError(interpretResult.errorMessages[0])
          }
        } else {
          updateError(parseResult.errorMessages[0])
        }
      },
      300
    )
  }
}
