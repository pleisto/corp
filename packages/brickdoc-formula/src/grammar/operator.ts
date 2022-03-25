import { CstNode, IToken } from 'chevrotain'
import {
  AnyTypeResult,
  CodeFragment,
  CodeFragmentResult,
  ErrorMessage,
  FormulaCheckType,
  FormulaType,
  FunctionContext
} from '../types'
import { CodeFragmentVisitor, CstVisitorArgument, token2fragment } from './codeFragment'
import { InterpretArgument, FormulaInterpreter } from './interpreter'
import { intersectType, runtimeCheckType, shouldReturnEarly } from './util'
export interface OperatorType {
  readonly name: string
  readonly skipReturnEarlyCheck?: boolean
  readonly skipReturnFinalCheck?: boolean
  readonly skipRhsCstParse?: boolean
  readonly reverseLhsAndRhs?: boolean
  readonly parentRuntimeCheckType: FormulaType
  readonly lhsType: FormulaCheckType
  readonly dynamicLhs?: (lhsArgs: InterpretArgument) => AnyTypeResult
  readonly dynamicRhsType?: (
    result: AnyTypeResult,
    cst: CstNode,
    args: InterpretArgument,
    index: number
  ) => InterpretArgument
  readonly packageInterpretResult?: (result: AnyTypeResult) => AnyTypeResult
  readonly rhsType: FormulaCheckType
  readonly parse?: ({
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
  }) => CodeFragmentResult
  readonly interpret: ({
    ctx,
    lhs,
    rhs,
    operator,
    cst
  }: {
    ctx: FunctionContext
    lhs: AnyTypeResult
    rhs: AnyTypeResult | undefined
    operator: IToken
    cst: CstNode
  }) => Promise<AnyTypeResult>
}

export const interpretByOperator = async ({
  interpreter,
  operators,
  operator: {
    name,
    parentRuntimeCheckType,
    dynamicRhsType,
    dynamicLhs,
    lhsType,
    rhsType,
    interpret,
    skipReturnEarlyCheck,
    skipReturnFinalCheck,
    packageInterpretResult
  },
  args,
  lhs,
  rhs
}: {
  interpreter: FormulaInterpreter
  operator: OperatorType
  operators: IToken[]
  args: InterpretArgument
  lhs: CstNode | CstNode[]
  rhs: CstNode[] | undefined
}): Promise<AnyTypeResult> => {
  if (!rhs) {
    return dynamicLhs ? dynamicLhs(args) : await interpreter.visit(lhs, args)
  }

  const typeErrorBefore = runtimeCheckType(args, parentRuntimeCheckType, `${name} before`, interpreter.ctx)
  if (shouldReturnEarly(typeErrorBefore)) return typeErrorBefore!

  const lhsArgs: InterpretArgument = { ...args, type: lhsType, finalTypes: [] }
  let result = dynamicLhs ? dynamicLhs(lhsArgs) : await interpreter.visit(lhs, lhsArgs)
  if (shouldReturnEarly(result, skipReturnEarlyCheck)) return result

  for (const { rhsOperand, index } of rhs.map((rhsOperand, index: number) => ({ index, rhsOperand }))) {
    if (shouldReturnEarly(result, skipReturnEarlyCheck)) break

    const rhsArgs: InterpretArgument = dynamicRhsType
      ? dynamicRhsType(result, rhsOperand, args, index)
      : { ...args, type: rhsType, finalTypes: [] }

    const rhsValue = (rhsOperand as any).image ? undefined : await interpreter.visit(rhsOperand, rhsArgs)

    if (shouldReturnEarly(rhsValue, skipReturnEarlyCheck)) {
      result = rhsValue!
      break
    }

    const operator = operators[index]

    if (!operator) {
      throw new Error(`Operator not found`)
    }

    result = await interpret({ ctx: interpreter.ctx, lhs: result, rhs: rhsValue, operator, cst: rhsOperand })
  }

  if (packageInterpretResult) {
    result = packageInterpretResult(result)
  }

  if (!skipReturnFinalCheck) {
    const typeErrorAfter = runtimeCheckType(args, result.type, `${name} after`, interpreter.ctx)
    if (shouldReturnEarly(typeErrorAfter)) return typeErrorAfter!
  }

  return result
}

export const parseByOperator = ({
  cstVisitor,
  operators,
  operator: { name, parentRuntimeCheckType, lhsType, rhsType, skipRhsCstParse, reverseLhsAndRhs },
  args,
  lhs,
  rhs
}: {
  cstVisitor: CodeFragmentVisitor
  operator: OperatorType
  operators: IToken[]
  args: CstVisitorArgument
  lhs: CstNode | CstNode[]
  rhs: CstNode[] | undefined
}): CodeFragmentResult => {
  if (!rhs) {
    return cstVisitor.visit(lhs, args)
  }

  const rhsCodeFragments: CodeFragment[] = []
  const rhsImages: string[] = []

  const { codeFragments: lhsCodeFragments, image: lhsImage }: CodeFragmentResult = cstVisitor.visit(lhs, {
    ...args,
    type: lhsType
  })

  rhs.forEach((rhsOperand, idx: number) => {
    const missingTokenErrorMessages: ErrorMessage[] = []

    if (skipRhsCstParse) {
      const operator = operators[idx]
      rhsCodeFragments.push({ ...token2fragment(operator, parentRuntimeCheckType), errors: missingTokenErrorMessages })
      rhsImages.push(operator.image)
      return
    }

    const { codeFragments: rhsValue, image: rhsImage }: CodeFragmentResult = cstVisitor.visit(rhsOperand, {
      type: rhsType
    })
    if (!rhsValue.length) {
      missingTokenErrorMessages.push({ message: 'Missing expression', type: 'syntax' })
    }

    const operator = operators[idx]
    rhsCodeFragments.push({ ...token2fragment(operator, parentRuntimeCheckType), errors: missingTokenErrorMessages })
    rhsImages.push(operator.image)

    rhsCodeFragments.push(...rhsValue)
    rhsImages.push(rhsImage)
  })

  const finalCodeFragments: CodeFragment[] = reverseLhsAndRhs
    ? [...rhsCodeFragments, ...lhsCodeFragments]
    : [...lhsCodeFragments, ...rhsCodeFragments]
  const finalImages: string[] = reverseLhsAndRhs ? [...rhsImages, lhsImage] : [lhsImage, ...rhsImages]

  const { errorMessages, newType } = intersectType(args.type, parentRuntimeCheckType, name, cstVisitor.ctx)
  return {
    image: finalImages.join(''),
    codeFragments: finalCodeFragments.map(c => ({ ...c, errors: [...errorMessages, ...c.errors] })),
    type: newType
  }
}
