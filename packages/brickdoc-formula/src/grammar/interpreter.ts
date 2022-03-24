/* eslint-disable no-continue */
import { CstElement, CstNode, IToken } from 'chevrotain'
import {
  AnyTypeResult,
  NullResult,
  SpreadsheetResult,
  NumberResult,
  BooleanResult,
  PredicateResult,
  ReferenceResult,
  ErrorResult,
  Argument,
  FunctionContext,
  FormulaType,
  ExpressionType,
  BlockResult
} from '../types'
import { extractSubType, parseString, runtimeCheckType, shouldReturnEarly } from './util'
import { buildFunctionKey } from '../functions'
import { BlockClass } from '../controls/block'
import { ParserInstance } from './parser'
import {
  additionOperator,
  combineOperator,
  compareOperator,
  concatOperator,
  equalCompareOperator,
  expressionOperator,
  inOperator,
  multiplicationOperator,
  notOperator,
  predicateOperator,
  rangeOperator
} from './operations'
import { interpretByOperator } from './operator'

export interface ExpressionArgument {
  readonly type: ExpressionType
  readonly firstArgumentType?: FormulaType
  readonly finalTypes: ExpressionType[]
  skipCheck?: boolean
  lazy?: boolean
  chainArgs?: any
}

// const InterpretCstVisitor = ParserInstance.getBaseCstVisitorConstructor<ExpressionArgument, Promise<AnyTypeResult>>()
const InterpretCstVisitor = ParserInstance.getBaseCstVisitorConstructor()

export class FormulaInterpreter extends InterpretCstVisitor {
  ctx: FunctionContext
  lazy: boolean = false

  constructor({ ctx }: { ctx: FunctionContext }) {
    super()
    this.ctx = ctx
    // This helper will detect any missing or redundant methods on this visitor
    this.validateVisitor()
  }

  async startExpression(ctx: { expression: CstNode | CstNode[] }, args: ExpressionArgument): Promise<AnyTypeResult> {
    return this.visit(ctx.expression, args)
  }

  async expression(ctx: any, args: ExpressionArgument): Promise<AnyTypeResult> {
    return await interpretByOperator({
      interpreter: this,
      operators: ctx.Semicolon,
      args,
      operator: expressionOperator,
      rhs: ctx.rhs,
      lhs: ctx.lhs
    })
  }

  async combineExpression(ctx: any, args: ExpressionArgument): Promise<AnyTypeResult> {
    return await interpretByOperator({
      interpreter: this,
      operators: ctx.CombineOperator,
      args,
      operator: combineOperator,
      rhs: ctx.rhs,
      lhs: ctx.lhs
    })
  }

  async notExpression(ctx: any, args: ExpressionArgument): Promise<AnyTypeResult> {
    return await interpretByOperator({
      interpreter: this,
      operators: ctx.lhs,
      args,
      operator: notOperator,
      rhs: ctx.lhs,
      lhs: ctx.rhs
    })
  }

  async equalCompareExpression(ctx: any, args: ExpressionArgument): Promise<AnyTypeResult> {
    return await interpretByOperator({
      interpreter: this,
      operators: ctx.EqualCompareOperator,
      args,
      operator: equalCompareOperator,
      rhs: ctx.rhs,
      lhs: ctx.lhs
    })
  }

  async compareExpression(ctx: any, args: ExpressionArgument): Promise<AnyTypeResult> {
    return await interpretByOperator({
      interpreter: this,
      operators: ctx.CompareOperator,
      args,
      operator: compareOperator,
      rhs: ctx.rhs,
      lhs: ctx.lhs
    })
  }

  async inExpression(ctx: any, args: ExpressionArgument): Promise<AnyTypeResult> {
    return await interpretByOperator({
      interpreter: this,
      operators: ctx.InOperator,
      args,
      operator: inOperator,
      rhs: ctx.rhs,
      lhs: ctx.lhs
    })
  }

  async concatExpression(ctx: any, args: ExpressionArgument): Promise<AnyTypeResult> {
    return await interpretByOperator({
      interpreter: this,
      operators: ctx.Ampersand,
      args,
      operator: concatOperator,
      rhs: ctx.rhs,
      lhs: ctx.lhs
    })
  }

  async additionExpression(ctx: any, args: ExpressionArgument): Promise<AnyTypeResult> {
    return await interpretByOperator({
      interpreter: this,
      operators: ctx.AdditionOperator,
      args,
      operator: additionOperator,
      rhs: ctx.rhs,
      lhs: ctx.lhs
    })
  }

  async multiplicationExpression(ctx: any, args: ExpressionArgument): Promise<AnyTypeResult> {
    return await interpretByOperator({
      interpreter: this,
      operators: ctx.MultiplicationOperator,
      args,
      operator: multiplicationOperator,
      rhs: ctx.rhs,
      lhs: ctx.lhs
    })
  }

  async rangeExpression(ctx: any, args: ExpressionArgument): Promise<AnyTypeResult> {
    return await interpretByOperator({
      interpreter: this,
      operators: ctx.Colon,
      args,
      operator: rangeOperator,
      rhs: ctx.rhs,
      lhs: ctx.lhs
    })
  }

  async chainExpression(
    ctx: { lhs: CstNode | CstNode[]; rhs: any[] },
    args: ExpressionArgument
  ): Promise<AnyTypeResult> {
    if (!ctx.rhs) {
      return this.visit(ctx.lhs, args)
    }

    let result: AnyTypeResult = await this.visit(ctx.lhs, { ...args, type: 'any' })
    if (shouldReturnEarly(result)) return result

    for (const cst of ctx.rhs) {
      if (shouldReturnEarly(result)) break

      if (cst.name === 'FunctionCall') {
        result = await this.visit(cst, { ...args, chainArgs: result })
        continue
      }

      if (cst.name === 'keyExpression') {
        const { result: key } = await this.visit(cst, { ...args, type: 'any' })

        if (result.type === 'Block' || result.type === 'Spreadsheet' || result.type === 'Column') {
          result = await result.result.handleInterpret(key)
          continue
        }

        if (result.type === 'Record') {
          const value = result.result[key]
          if (value) {
            result = value
          } else {
            result = { type: 'Error', result: `Key ${key} not found`, errorKind: 'runtime' }
          }

          continue
        }

        if (result.type === 'Array') {
          const number = Number(key)
          if (isNaN(number)) {
            result = { type: 'Error', result: `Need a number: ${key}`, errorKind: 'syntax' }
          } else {
            result = result.result[number - 1] || {
              type: 'Error',
              result: `Index ${number} out of bounds`,
              errorKind: 'runtime'
            }
          }
          continue
        }

        if (result.type === 'Reference') {
          result = { type: 'Reference', result: { ...result.result, attribute: key } }
          continue
        }

        result = { type: 'Error', result: `Access not supported for ${result.type}`, errorKind: 'runtime' }
        continue
      }

      throw new Error(`Unexpected CST node ${cst.name}`)
    }

    const typeError = runtimeCheckType(args, result.type, 'chainExpression', this.ctx)
    if (shouldReturnEarly(typeError)) return typeError!

    return result
  }

  async accessExpression(
    ctx: { lhs: CstNode | CstNode[]; rhs: any[] },
    args: ExpressionArgument
  ): Promise<AnyTypeResult> {
    if (!ctx.rhs) {
      return this.visit(ctx.lhs, args)
    }

    let result: AnyTypeResult = await this.visit(ctx.lhs, { ...args, type: 'any' })
    if (shouldReturnEarly(result)) return result

    for (const cst of ctx.rhs) {
      if (shouldReturnEarly(result)) break

      const { result: key } = await this.visit(cst, { ...args, type: 'any' })

      if (result.type === 'Block' || result.type === 'Spreadsheet' || result.type === 'Column') {
        result = await result.result.handleInterpret(key)
        continue
      }

      if (result.type === 'Record') {
        const value = result.result[key]
        if (value) {
          result = value
        } else {
          result = { type: 'Error', result: `Key ${key} not found`, errorKind: 'runtime' }
        }

        continue
      }

      if (result.type === 'Array') {
        const number = Number(key)
        if (isNaN(number)) {
          result = { type: 'Error', result: `Need a number: ${key}`, errorKind: 'syntax' }
        } else {
          result = result.result[number - 1] || {
            type: 'Error',
            result: `Index ${number} out of bounds`,
            errorKind: 'runtime'
          }
        }
        continue
      }

      if (result.type === 'Reference') {
        result = { type: 'Reference', result: { ...result.result, attribute: key } }
        continue
      }

      result = { type: 'Error', result: `Access not supported for ${result.type}`, errorKind: 'runtime' }
      continue
    }

    const typeError = runtimeCheckType(args, result.type, 'accessExpression', this.ctx)
    if (shouldReturnEarly(typeError)) return typeError!

    return result
  }

  async keyExpression(ctx: any, args: ExpressionArgument): Promise<AnyTypeResult> {
    if (ctx.FunctionName) {
      return this.FunctionNameExpression(ctx, args)
    } else if (ctx.StringLiteral) {
      return this.StringLiteralExpression(ctx, args)
    } else if (ctx.NumberLiteral) {
      return this.NumberLiteralExpression(ctx, { ...args, skipCheck: true })
    } else {
      throw new Error('Unexpected key expression')
    }
  }

  async simpleAtomicExpression(
    ctx: {
      parenthesisExpression: CstNode | CstNode[]
      arrayExpression: CstNode | CstNode[]
      recordExpression: CstNode | CstNode[]
      constantExpression: CstNode | CstNode[]
      FunctionCall: CstNode | CstNode[]
      lazyVariableExpression: CstNode | CstNode[]
    },
    args: ExpressionArgument
  ): Promise<AnyTypeResult> {
    if (ctx.parenthesisExpression) {
      return this.visit(ctx.parenthesisExpression, args)
    } else if (ctx.arrayExpression) {
      return this.visit(ctx.arrayExpression, args)
    } else if (ctx.recordExpression) {
      return this.visit(ctx.recordExpression, args)
    } else if (ctx.constantExpression) {
      return this.visit(ctx.constantExpression, args)
    } else if (ctx.FunctionCall) {
      return this.visit(ctx.FunctionCall, args)
    } else if (ctx.lazyVariableExpression) {
      return this.visit(ctx.lazyVariableExpression, args)
    } else {
      // devLog({ ctx })
      throw new Error('unsupported expression')
    }
  }

  async atomicExpression(
    ctx: {
      simpleAtomicExpression: CstNode | CstNode[]
      blockExpression: CstNode | CstNode[]
      referenceExpression: CstNode | CstNode[]
      predicateExpression: CstNode | CstNode[]
    },
    args: ExpressionArgument
  ): Promise<AnyTypeResult> {
    if (ctx.simpleAtomicExpression) {
      return this.visit(ctx.simpleAtomicExpression, args)
    } else if (ctx.referenceExpression) {
      return this.visit(ctx.referenceExpression, args)
    } else if (ctx.blockExpression) {
      return this.visit(ctx.blockExpression, args)
    } else if (ctx.predicateExpression) {
      return this.visit(ctx.predicateExpression, args)
    } else {
      // devLog({ ctx })
      throw new Error('unsupported expression')
    }
  }

  async predicateExpression(
    ctx: {
      EqualCompareOperator: IToken[]
      CompareOperator: IToken[]
      simpleAtomicExpression: CstNode | CstNode[]
    },
    args: ExpressionArgument
  ): Promise<AnyTypeResult> {
    let operators: IToken[]
    if (ctx.EqualCompareOperator) {
      operators = ctx.EqualCompareOperator
    } else {
      operators = ctx.CompareOperator
    }
    return await interpretByOperator({
      interpreter: this,
      operators,
      args,
      operator: predicateOperator,
      rhs: operators as unknown as CstNode[],
      lhs: ctx.simpleAtomicExpression
    })
  }

  async arrayExpression(ctx: { Arguments: CstNode | CstNode[] }, args: ExpressionArgument): Promise<AnyTypeResult> {
    const parentType: FormulaType = 'Array'
    const typeError = runtimeCheckType(args, parentType, 'arrayExpression', this.ctx)
    if (shouldReturnEarly(typeError)) return typeError!

    const arrayArgs: AnyTypeResult[] = []

    if (ctx.Arguments) {
      arrayArgs.push(...(await this.visit(ctx.Arguments, { ...args, type: 'any', finalTypes: [] })))
    }

    return { type: 'Array', subType: extractSubType(arrayArgs), result: arrayArgs }
  }

  async recordExpression(ctx: any, args: ExpressionArgument): Promise<AnyTypeResult> {
    const parentType: FormulaType = 'Record'
    const typeError = runtimeCheckType(args, parentType, 'recordExpression', this.ctx)
    if (shouldReturnEarly(typeError)) return typeError!

    if (!ctx.recordField) {
      return { type: 'Record', subType: 'void', result: {} }
    }

    const result: Record<string, AnyTypeResult> = {}
    for (const c of ctx.recordField) {
      const { key, value } = await this.visit(c, { ...args, type: 'any' })
      result[key] = value
    }

    return { type: 'Record', subType: extractSubType(Object.values(result)), result }
  }

  async recordField(ctx: any, args: ExpressionArgument): Promise<{ key: string; value: AnyTypeResult }> {
    const { result: key } = await this.visit(ctx.keyExpression, { ...args, type: 'string' })
    const value = await this.visit(ctx.expression, { ...args, type: 'any' })

    return { key, value }
  }

  async parenthesisExpression(
    ctx: { expression: CstNode | CstNode[] },
    args: ExpressionArgument
  ): Promise<AnyTypeResult> {
    return this.visit(ctx.expression, args)
  }

  StringLiteralExpression(
    ctx: {
      NumberLiteralExpression?: CstNode | CstNode[]
      BooleanLiteralExpression?: CstNode | CstNode[]
      NullLiteral?: CstNode | CstNode[]
      StringLiteral: any
    },
    args: ExpressionArgument
  ): AnyTypeResult {
    const parentType: FormulaType = 'string'
    const typeError = runtimeCheckType(args, parentType, 'StringLiteralExpression', this.ctx)
    if (shouldReturnEarly(typeError)) return typeError!

    const str = ctx.StringLiteral[0].image
    return { result: parseString(str), type: 'string' }
  }

  FunctionNameExpression(ctx: { FunctionName: Array<{ image: any }> }, args: ExpressionArgument): AnyTypeResult {
    const parentType: FormulaType = 'string'
    const typeError = runtimeCheckType(args, parentType, 'FunctionNameExpression', this.ctx)
    if (shouldReturnEarly(typeError)) return typeError!

    return { result: ctx.FunctionName[0].image, type: 'string' }
  }

  constantExpression(
    ctx: {
      NumberLiteralExpression: CstNode | CstNode[]
      BooleanLiteralExpression: CstNode | CstNode[]
      NullLiteral: CstNode | CstNode[]
      StringLiteral: Array<{ image: any }>
    },
    args: ExpressionArgument
  ): AnyTypeResult {
    if (ctx.NumberLiteralExpression) {
      return this.visit(ctx.NumberLiteralExpression, args)
    } else if (ctx.BooleanLiteralExpression) {
      return this.visit(ctx.BooleanLiteralExpression, args)
    } else if (ctx.NullLiteral) {
      const parentType: FormulaType = 'null'
      const typeError = runtimeCheckType(args, parentType, 'constantExpression', this.ctx)
      if (shouldReturnEarly(typeError)) return typeError!

      return { type: 'null', result: null }
    } else if (ctx.StringLiteral) {
      return this.StringLiteralExpression(ctx, args)
    } else {
      throw new Error('unsupported expression')
    }
  }

  async blockExpression(
    ctx: any,
    args: ExpressionArgument
  ): Promise<NullResult | SpreadsheetResult | BlockResult | ErrorResult> {
    let namespaceId
    if (ctx.UUID) {
      namespaceId = ctx.UUID[0].image
    } else if (ctx.CurrentBlock) {
      namespaceId = this.ctx.meta.namespaceId
    } else {
      throw new Error('unsupported expression')
    }

    const formulaName = this.ctx.formulaContext.findFormulaName(namespaceId)

    if (formulaName?.kind === 'Spreadsheet') {
      const parentType: FormulaType = 'Spreadsheet'
      const typeError = runtimeCheckType(args, parentType, 'blockExpression', this.ctx)
      if (shouldReturnEarly(typeError)) return typeError!

      const spreadsheet = this.ctx.formulaContext.findSpreadsheet(namespaceId)
      if (!spreadsheet) {
        return { type: 'Error', result: `Spreadsheet ${namespaceId} not found`, errorKind: 'runtime' }
      }
      return { type: 'Spreadsheet', result: spreadsheet }
    }

    if (formulaName?.kind === 'Block') {
      const parentType: FormulaType = 'Block'
      const typeError = runtimeCheckType(args, parentType, 'blockExpression', this.ctx)
      if (shouldReturnEarly(typeError)) return typeError!

      const block = new BlockClass(this.ctx.formulaContext, { id: namespaceId })
      return { type: 'Block', result: block }
    }

    return { type: 'null', result: null }
  }

  // TODO runtime type check
  async referenceExpression(
    ctx: { lazyVariableExpression: CstNode | CstNode[] },
    args: ExpressionArgument
  ): Promise<ReferenceResult> {
    return this.visit(ctx.lazyVariableExpression, { ...args, type: 'any', lazy: true })
  }

  async lazyVariableExpression(ctx: any, args: ExpressionArgument): Promise<AnyTypeResult> {
    if (ctx.Self) {
      // TODO runtime type check
      return { type: 'Reference', result: { kind: 'self' } }
    } else if (ctx.LambdaArgumentNumber) {
      // TODO runtime type check
      const number = Number(ctx.LambdaArgumentNumber[0].image.substring(1))
      const result = this.ctx.interpretContext.arguments[number - 1]

      if (result) {
        return result
      }
      return { type: 'Error', result: `Argument ${number} not found`, errorKind: 'runtime' }
    } else if (ctx.Input) {
      const parentType: FormulaType = 'Record'
      const typeError = runtimeCheckType(args, parentType, 'lazyVariableExpression', this.ctx)
      if (shouldReturnEarly(typeError)) return typeError!

      return {
        type: 'Record',
        subType: extractSubType(Object.values(this.ctx.interpretContext.ctx)),
        result: this.ctx.interpretContext.ctx
      }
    } else {
      // devLog({ ctx })
      throw new Error('unsupported expression')
    }
  }

  NumberLiteralExpression(
    ctx: { NumberLiteral: Array<{ image: any }>; DecimalLiteral: any; Sign: any; Minus: any },
    args: ExpressionArgument
  ): NumberResult | ErrorResult {
    const parentType: FormulaType = 'number'
    const typeError = runtimeCheckType(args, parentType, 'NumberLiteralExpression', this.ctx)
    if (shouldReturnEarly(typeError)) return typeError!

    const image = ctx.DecimalLiteral ? ctx.DecimalLiteral[0].image : ctx.NumberLiteral[0].image
    const number = Number(image)

    const numberAfterSign = ctx.Sign ? number * 0.01 : number

    return { result: ctx.Minus ? numberAfterSign * -1 : numberAfterSign, type: 'number' }
  }

  BooleanLiteralExpression(
    ctx: { BooleanLiteral: Array<{ image: string }> },
    args: ExpressionArgument
  ): BooleanResult | ErrorResult {
    const parentType: FormulaType = 'boolean'
    const typeError = runtimeCheckType(args, parentType, 'BooleanLiteralExpression', this.ctx)
    if (shouldReturnEarly(typeError)) return typeError!
    return { result: ['true'].includes(ctx.BooleanLiteral[0].image), type: 'boolean' }
  }

  // eslint-disable-next-line complexity
  async FunctionCall(
    ctx: {
      FunctionName: Array<{ image: any }>
      Arguments: CstNode[]
    },
    args: ExpressionArgument
  ): Promise<AnyTypeResult> {
    const chainArgs = args?.chainArgs
    const names = ctx.FunctionName.map(group => group.image)
    const [group, name] = names.length === 1 ? ['core', ...names] : names

    const clause = this.ctx.formulaContext.findFunctionClause(group, name)

    const functionKey = buildFunctionKey(group, name, true)

    if (!clause) {
      throw new Error(`Function ${functionKey} not found`)
    }

    if (clause.feature && !this.ctx.formulaContext.features.includes(clause.feature)) {
      throw new Error(`Feature ${clause.feature} not enabled`)
    }

    const typeError = runtimeCheckType(args, clause.returns, 'FunctionCall', this.ctx)
    if (shouldReturnEarly(typeError)) return typeError!

    let functionArgs: AnyTypeResult[] = []

    if (clause.chain && chainArgs) {
      const firstArgs = clause.args[0]
      const typeError = runtimeCheckType(chainArgs.type, firstArgs.type, 'FunctionCallFirstArg', this.ctx)
      if (shouldReturnEarly(typeError)) return typeError!

      functionArgs.push(chainArgs)
    }

    if (clause.lazy) {
      // TODO runtime type check
      const argsTypes = clause.args.map(arg => arg.type)

      if (!ctx.Arguments || !ctx.Arguments[0].children?.expression) {
        return { type: 'Error', result: 'Function is empty', errorKind: 'runtime' }
      }

      for (const { e, index } of ctx.Arguments[0].children?.expression.map((e: CstElement, index: number) => ({
        e,
        index
      }))) {
        const argType = argsTypes[clause.chain && chainArgs ? index + 1 : index]

        const element = e as CstNode

        if (argType === 'Cst') {
          this.lazy = true
          functionArgs.push({ type: 'Cst', result: element })
        } else {
          functionArgs.push(await this.visit(element, { lazy: argType === 'Reference' }))
        }
      }
    } else {
      if (ctx.Arguments) {
        const clauseArguments = clause.chain && chainArgs ? clause.args.slice(1) : clause.args
        const argResult = await this.visit(ctx.Arguments, { ...args, finalTypes: clauseArguments.map(e => e.type) })
        functionArgs.push(...argResult)
      }

      const argsTypes: Argument[] = clause.args[0]?.spread
        ? Array(functionArgs.length).fill(clause.args[0])
        : clause.args

      if (!clause.acceptError) {
        const errorArgs = functionArgs.find(a => shouldReturnEarly(a))
        if (errorArgs) {
          return errorArgs as AnyTypeResult
        }
      }

      functionArgs = argsTypes.map((argType, index) => {
        const v = functionArgs[index] || argType.default
        if (!v) {
          throw new Error(`Argument ${index} is not defined`)
        }

        if (argType.type === 'Predicate' && ['number', 'string'].includes(v.type)) {
          return { type: 'Predicate', result: v as PredicateResult['result'], operator: 'equal' }
        } else {
          return v
        }
      })
    }

    return (clause.reference as (ctx: FunctionContext, ...args: any[]) => any)(this.ctx, ...functionArgs)
  }

  async Arguments(ctx: { expression: any[] }, args: ExpressionArgument): Promise<AnyTypeResult[]> {
    return await Promise.all(
      ctx.expression.map(async (arg: CstNode | CstNode[], index: number) => {
        const type = args.finalTypes[index] ?? 'any'
        const result = await this.visit(arg, { ...args, type })
        return result
      })
    )
  }
}
