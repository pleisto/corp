import { CstNode, IToken } from 'chevrotain'
import { AnyTypeResult, FormulaCheckType, FormulaType, FunctionContext } from '../types'
import { ExpressionArgument, FormulaInterpreter } from './interpreter'
import { runtimeCheckType, shouldReturnEarly } from './util'

export interface OperatorType {
  readonly name: string
  readonly skipReturnEarlyCheck?: boolean
  readonly parentRuntimeCheckType: FormulaType
  readonly lhsType: FormulaCheckType
  readonly rhsType:
    | FormulaCheckType
    | ((result: AnyTypeResult, cst: CstNode, args: ExpressionArgument) => ExpressionArgument)
  readonly interpret: ({
    ctx,
    lhs,
    rhs,
    operator,
    cst
  }: {
    ctx: FunctionContext
    lhs: AnyTypeResult
    rhs: AnyTypeResult
    operator: IToken
    cst: CstNode
  }) => Promise<AnyTypeResult>
}

interface InterpretByOperatorInput {
  interpreter: FormulaInterpreter
  operator: OperatorType
  operators: IToken[]
  args: ExpressionArgument
  lhs: CstNode | CstNode[]
  rhs: CstNode[] | undefined
}

export const interpretByOperator = async ({
  interpreter,
  operators,
  operator: { name, parentRuntimeCheckType, lhsType, rhsType, interpret, skipReturnEarlyCheck },
  args,
  lhs,
  rhs
}: InterpretByOperatorInput): Promise<AnyTypeResult> => {
  if (!rhs) {
    return interpreter.visit(lhs, args)
  }

  const typeError = runtimeCheckType(args, parentRuntimeCheckType, name, interpreter.ctx)
  if (shouldReturnEarly(typeError)) return typeError!

  const lhsArgs: ExpressionArgument = { ...args, type: lhsType }
  let result = await interpreter.visit(lhs, lhsArgs)

  if (shouldReturnEarly(result, skipReturnEarlyCheck)) return result

  for (const { rhsOperand, index } of rhs.map((rhsOperand, index: number) => ({ index, rhsOperand }))) {
    if (shouldReturnEarly(result, skipReturnEarlyCheck)) break

    const rhsArgs: ExpressionArgument =
      rhsType instanceof Function ? rhsType(result, rhsOperand, args) : { ...args, type: rhsType }

    const rhsValue = (rhsOperand as any).image ? null : await interpreter.visit(rhsOperand, rhsArgs)

    if (shouldReturnEarly(rhsValue, skipReturnEarlyCheck)) {
      result = rhsValue
      break
    }

    const operator = operators[index]

    if (!operator) {
      throw new Error(`Operator not found`)
    }

    result = await interpret({ ctx: interpreter.ctx, lhs: result, rhs: rhsValue, operator, cst: rhsOperand })
  }

  return result
}
