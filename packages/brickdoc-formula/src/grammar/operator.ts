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
  readonly dynamicInterpretLhs?: (lhsArgs: InterpretArgument) => AnyTypeResult
  readonly dynamicParseType?: (lhsType: FormulaType) => FormulaType
  readonly dynamicInterpretRhsType?: ({
    result,
    cst,
    operator,
    args,
    index
  }: {
    result: AnyTypeResult
    cst: CstNode
    operator: IToken | undefined
    args: InterpretArgument
    index: number
  }) => InterpretArgument
  readonly packageInterpretResult?: (result: AnyTypeResult) => AnyTypeResult
  readonly dynamicParseRhsType?: (
    cst: CstNode,
    prevType: FormulaType,
    args: CstVisitorArgument,
    index: number
  ) => CstVisitorArgument
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
    dynamicInterpretRhsType,
    dynamicInterpretLhs,
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
  lhs: CstNode[] | undefined
  rhs: CstNode[] | undefined
}): Promise<AnyTypeResult> => {
  if (!rhs) {
    return dynamicInterpretLhs ? dynamicInterpretLhs(args) : await interpreter.visit(lhs!, args)
  }

  const typeErrorBefore = runtimeCheckType(args, parentRuntimeCheckType, `${name} before`, interpreter.ctx)
  if (shouldReturnEarly(typeErrorBefore)) return typeErrorBefore!

  const lhsArgs: InterpretArgument = { ...args, type: lhsType, finalTypes: [] }
  // eslint-disable-next-line no-nested-ternary
  let result: AnyTypeResult = dynamicInterpretLhs
    ? dynamicInterpretLhs(lhsArgs)
    : lhs
    ? await interpreter.visit(lhs, lhsArgs)
    : { type: 'null', result: null }
  if (shouldReturnEarly(result, skipReturnEarlyCheck)) return result

  for (const { rhsOperand, index } of rhs.map((rhsOperand, index: number) => ({ index, rhsOperand }))) {
    if (shouldReturnEarly(result, skipReturnEarlyCheck)) break
    const operator = operators[index]

    const rhsArgs: InterpretArgument = dynamicInterpretRhsType
      ? dynamicInterpretRhsType({ result, cst: rhsOperand, operator, args, index })
      : { ...args, type: rhsType, finalTypes: [] }

    const rhsValue = (rhsOperand as any).image ? undefined : await interpreter.visit(rhsOperand, rhsArgs)

    if (shouldReturnEarly(rhsValue, skipReturnEarlyCheck)) {
      result = rhsValue!
      break
    }

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
  prefixToken,
  suffixToken,
  operators,
  operator: {
    name,
    parentRuntimeCheckType,
    lhsType,
    rhsType,
    skipRhsCstParse,
    reverseLhsAndRhs,
    dynamicParseRhsType,
    dynamicParseType
  },
  args,
  lhs,
  rhs
}: {
  cstVisitor: CodeFragmentVisitor
  operator: OperatorType
  operators: IToken[]
  args: CstVisitorArgument
  prefixToken?: IToken[]
  suffixToken?: IToken[]
  lhs: CstNode[] | undefined
  rhs: CstNode[] | undefined
}): CodeFragmentResult => {
  if (!rhs) {
    return cstVisitor.visit(lhs!, args)
  }

  const rhsCodeFragments: CodeFragment[] = []
  const rhsImages: string[] = []

  const {
    codeFragments: lhsCodeFragments,
    image: lhsImage,
    type: lhsDataType
  }: CodeFragmentResult = lhs
    ? cstVisitor.visit(lhs, {
        ...args,
        type: lhsType
      })
    : { codeFragments: [], image: '', type: 'any' }
  let prevType = lhsDataType

  rhs.forEach((rhsOperand, idx: number) => {
    const missingTokenErrorMessages: ErrorMessage[] = []

    if (skipRhsCstParse) {
      const operator = operators[idx]
      rhsCodeFragments.push({ ...token2fragment(operator, parentRuntimeCheckType), errors: missingTokenErrorMessages })
      rhsImages.push(operator.image)
      return
    }

    const rhsArgs = dynamicParseRhsType
      ? dynamicParseRhsType(rhsOperand, prevType, args, idx)
      : { ...args, type: rhsType }
    const {
      codeFragments: rhsValue,
      image: rhsImage,
      type: rhsDataType
    }: CodeFragmentResult = cstVisitor.visit(rhsOperand, rhsArgs)
    prevType = rhsDataType

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

  if (prefixToken?.[0]) {
    finalCodeFragments.unshift({
      ...token2fragment(prefixToken[0], 'any'),
      errors: suffixToken?.[0] ? [] : [{ message: 'Missing closing token', type: 'syntax' }]
    })
    finalImages.unshift(prefixToken[0].image)
  }

  if (suffixToken?.[0]) {
    finalCodeFragments.push({
      ...token2fragment(suffixToken[0], 'any'),
      errors: prefixToken?.[0] ? [] : [{ message: 'Missing opening token', type: 'syntax' }]
    })
    finalImages.push(suffixToken[0].image)
  }

  const finalType = dynamicParseType ? dynamicParseType(prevType) : parentRuntimeCheckType
  const { errorMessages, newType } = intersectType(args.type, finalType, name, cstVisitor.ctx)
  return {
    image: finalImages.join(''),
    codeFragments: finalCodeFragments.map(c => ({ ...c, errors: [...errorMessages, ...c.errors] })),
    type: newType
  }
}
