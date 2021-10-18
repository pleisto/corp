import { Mark, mergeAttributes } from '@tiptap/core'
import { v4 as uuid } from 'uuid'

export interface FormulaVariable {
  identify: string
  name: string
  value: string
}

const variableStore: { [key: string]: string } = {}

export interface FormulaOptions {
  HTMLAttributes: Record<string, any>
  variables: { [key: string]: FormulaVariable }
}

const calculate = (value: string): string => {
  if (!isNaN(Number(value))) return String(value)
  let formula = value

  Object.keys(variableStore).forEach(name => {
    formula = formula.replaceAll(name, variableStore[name])
  })

  // eslint-disable-next-line no-eval
  return String(eval(formula))
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    formula: {
      /**
       * Set an formula mark
       */
      setFormula: (name: string, value: string) => ReturnType
      /**
       * Unset an formula mark
       */
      unsetFormula: () => ReturnType
      /**
       * Get Variable info
       */
      getFormulaVariable: (cb: (variable?: FormulaVariable) => void) => ReturnType
    }
  }
}

const CSS_CLASS = 'brickdoc-formula'

export const FormulaExtension = Mark.create<FormulaOptions>({
  name: 'formula',

  defaultOptions: {
    HTMLAttributes: {
      class: CSS_CLASS
    },
    variables: {}
  },

  addAttributes() {
    return {
      variable: {
        default: {}
      },
      id: {
        default: uuid()
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: node => !!(node as HTMLElement).classList.contains(CSS_CLASS) && null
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setFormula:
        (name: string, value: string) =>
        ({ chain }) => {
          const { from } = this.editor.view.state.selection
          if (!isNaN(Number(value))) {
            variableStore[name] = value
          }

          const data = calculate(value)
          return chain()
            .insertContent(data)
            .setTextSelection({ from, to: from + data.length })
            .setMark(this.name, { variable: { name, value } })
            .focus()
            .run()
        },
      unsetFormula:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
      getFormulaVariable: cb => () => {
        const attrs = this.editor.getAttributes(this.name)
        cb(attrs.variable)
        return true
      }
    }
  }
})
