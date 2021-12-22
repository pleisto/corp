import { CstNode } from 'chevrotain'
import { FunctionContext, ControlType, FunctionResult, Reference } from '..'

export type Lambda = () => void

export const functionResult2lambda = (ctx: FunctionContext, { result }: FunctionResult, ctrl: ControlType): Lambda => {
  result.forEach(({ name }) => {
    if (name !== 'Set') {
      throw new Error('Only Set is supported')
    }
  })

  return () => {
    result.forEach(({ args: [ref, cst] }) => {
      const reference = ref.result as Reference
      const cstdata = cst.result as CstNode

      if (reference.kind !== 'variable') {
        throw new Error('Only variable reference is supported')
      }

      const variable = ctx.ctx.findVariable(reference.namespaceId, reference.variableId)!

      if (variable.t.kind === 'expression') {
        throw new Error('Only variable reference is supported')
      }

      variable.updateCst(cstdata)
    })

    console.log(`lambda called ${ctrl.kind}`)
  }
}
