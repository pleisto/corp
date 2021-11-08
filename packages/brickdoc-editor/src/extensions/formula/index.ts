import React from 'react'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { FormulaContext, Variable } from '@brickdoc/formula'
import { FormulaBlock } from './FormulaBlock'

export interface FormulaOptions {
  formulaContextActions: {
    getFormulaContext: () => FormulaContext | null
    getVariable: (variableId: string) => Variable | null | undefined
    removeVariable: (variableId: string) => void
    calculate: (
      variableId: string | undefined,
      name: string,
      input: string,
      formulaContext: FormulaContext,
      updateResult: React.Dispatch<React.SetStateAction<any>>,
      updateType: React.Dispatch<React.SetStateAction<string>>,
      updateVariable: React.Dispatch<React.SetStateAction<Variable | undefined>>,
      updateError: React.Dispatch<
        React.SetStateAction<
          | {
              type: string
              message: string
            }
          | undefined
        >
      >,
      updateValue: React.Dispatch<React.SetStateAction<string | undefined>>
    ) => void
  }
  formulaActions: {
    create: ({ id, name, definition, value }: { id: string; name: string; type: string; definition: string; value: string }) => Promise<{
      success: boolean
    }>
    update: ({ id, name, definition, value }: { id: string; name: string; type: string; definition: string; value: string }) => Promise<{
      success: boolean
    }>
    delete: (id: string) => Promise<{
      success: boolean
    }>
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    formula: {
      setFormula: (id: string, color: string, position?: number) => ReturnType
      setFormulaBlock: (position: number) => ReturnType
    }
  }
}

export const FormulaExtension = Node.create<FormulaOptions>({
  name: 'formulaBlock',

  group: 'inline',

  inline: true,

  atom: true,

  selectable: false,

  addAttributes() {
    return {
      formula: {
        default: {
          type: 'FORMULA',
          color: ''
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'formula-block'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['formula-block', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FormulaBlock)
  },

  addCommands() {
    return {
      setFormula:
        (id, color, position) =>
        ({ commands }) => {
          const content = { type: this.name, attrs: { formula: { type: 'FORMULA', id, color } } }
          if (position) return commands.insertContentAt(position, content)
          return commands.insertContent(content)
        },
      setFormulaBlock:
        (position: number) =>
        ({ commands }) => {
          return commands.insertContentAt(position, { type: this.name, attrs: { formula: { type: 'FORMULA' } } })
        }
    }
  }
})
