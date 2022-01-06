import { CstNode, ILexingResult, IRecognitionException } from 'chevrotain'
import {
  CodeFragment,
  ErrorMessage,
  ContextInterface,
  FunctionClause,
  VariableData,
  VariableDependency,
  VariableKind,
  VariableMetadata,
  VariableValue,
  View,
  VariableInterface,
  Completion,
  AnyTypeResult,
  ParseErrorType,
  CodeFragmentResult,
  NamespaceId,
  FunctionContext,
  Formula
} from '../types'
import { VariableClass, castVariable } from '../context/variable'
import { FormulaLexer } from './lexer'
import { FORMULA_PARSER_VERSION } from '../version'
import { FormulaParser } from './parser'
import { complete } from './completer'
import { FormulaInterpreter } from './interpreter'
import { CodeFragmentVisitor } from './code_fragment'
export interface BaseParseResult {
  readonly success: boolean
  readonly valid: boolean
  readonly input: string
  readonly version: number
  readonly position: number
  readonly inputImage: string
  readonly parseImage: string
  readonly cst?: CstNode
  readonly errorType?: ParseErrorType
  readonly kind?: VariableKind
  readonly level: number
  readonly errorMessages: ErrorMessage[]
  readonly variableDependencies: VariableDependency[]
  readonly functionDependencies: Array<FunctionClause<any>>
  readonly blockDependencies: NamespaceId[]
  readonly codeFragments: CodeFragment[]
  readonly flattenVariableDependencies: VariableDependency[]
  readonly completions: Completion[]
}

export interface SuccessParseResult extends BaseParseResult {
  readonly success: true
  readonly valid: true
  readonly errorMessages: []
  readonly cst: CstNode
  readonly kind: VariableKind
}

export interface ErrorParseResult extends BaseParseResult {
  readonly success: false
  readonly cst?: CstNode
  readonly errorType: ParseErrorType
  readonly errorMessages: [ErrorMessage, ...ErrorMessage[]]
}

export type ParseResult = SuccessParseResult | ErrorParseResult
export interface InterpretResult {
  readonly variableValue: VariableValue
  readonly lazy: boolean
}

export const abbrev = ({
  ctx: { formulaContext },
  input
}: {
  ctx: FunctionContext
  input: string
}): { lexResult: ILexingResult; newInput: string } => {
  const lexer = FormulaLexer
  const lexResult: ILexingResult = lexer.tokenize(input)
  const tokens = lexResult.tokens
  let modified = false
  const finalInputs: string[] = []

  tokens.forEach((token, index) => {
    if (token.tokenType.name !== 'FunctionName') {
      finalInputs.push(token.image)
      return
    }

    const nextToken = tokens[index + 1]

    if (nextToken && ['LParen', 'Colon'].includes(nextToken.tokenType.name)) {
      finalInputs.push(token.image)
      return
    }

    const prevToken = tokens[index - 1]
    if (prevToken && ['Dot'].includes(prevToken.tokenType.name)) {
      finalInputs.push(token.image)
      return
    }

    const formulaName = formulaContext.formulaNames.find(n => n.kind === 'Variable' && n.name === token.image)

    if (!formulaName) {
      finalInputs.push(token.image)
      return
    }

    finalInputs.push(formulaName.value)
    modified = true
  })

  if (modified) {
    const newInput = finalInputs.join('')
    return { lexResult: lexer.tokenize(newInput), newInput }
  } else {
    return { lexResult, newInput: input }
  }
}

export const parse = ({ ctx, position: pos }: { ctx: FunctionContext; position?: number }): ParseResult => {
  const {
    formulaContext,
    meta: { namespaceId, variableId, input, name }
  } = ctx
  const position = pos ?? 0
  let level = 0
  let variableDependencies: VariableDependency[] = []
  let functionDependencies: Array<FunctionClause<any>> = []
  let blockDependencies: NamespaceId[] = []
  let flattenVariableDependencies: VariableDependency[] = []
  const version = FORMULA_PARSER_VERSION
  if (!variableId) {
    return {
      success: false,
      inputImage: '',
      parseImage: '',
      valid: false,
      cst: undefined,
      input,
      position,
      version,
      level,
      errorType: 'parse',
      completions: [],
      errorMessages: [{ message: 'Miss variableId', type: 'fatal' }],
      codeFragments: [],
      variableDependencies,
      functionDependencies,
      blockDependencies,
      flattenVariableDependencies
    }
  }
  const baseCompletion = formulaContext.completions(namespaceId, variableId)
  let completions: Completion[] = baseCompletion

  const parser = new FormulaParser()
  const codeFragmentVisitor = new CodeFragmentVisitor({ ctx })

  const {
    lexResult: { tokens, errors: lexErrors },
    newInput
  } = abbrev({ ctx, input })

  parser.input = tokens
  const inputImage = tokens.map(t => t.image).join('')

  const cst: CstNode = parser.startExpression()
  const { codeFragments, image }: CodeFragmentResult = codeFragmentVisitor.visit(cst, { type: 'any' })

  const errorCodeFragment = codeFragments.find(f => f.errors.length)
  const finalErrorMessages: ErrorMessage[] = errorCodeFragment ? errorCodeFragment.errors : []

  level = codeFragmentVisitor.level
  variableDependencies = codeFragmentVisitor.variableDependencies
  functionDependencies = codeFragmentVisitor.functionDependencies
  blockDependencies = codeFragmentVisitor.blockDependencies
  flattenVariableDependencies = codeFragmentVisitor.flattenVariableDependencies

  const parseErrors: IRecognitionException[] = parser.errors

  completions = complete({
    input,
    cacheCompletions: baseCompletion,
    codeFragments,
    tokens,
    formulaContext,
    namespaceId,
    variableId
  })

  if (lexErrors.length > 0 || parseErrors.length > 0) {
    const errorMessages = (lexErrors.length ? lexErrors : parseErrors).map(e => ({
      message: e.message,
      type: 'parse'
    })) as [ErrorMessage, ...ErrorMessage[]]

    finalErrorMessages.push(...errorMessages)

    if (inputImage.startsWith(image)) {
      const restImages = inputImage.slice(image.length)
      if (restImages.length > 0) {
        codeFragments.push({
          code: 'other',
          name: restImages,
          spaceAfter: false,
          spaceBefore: false,
          type: 'any',
          render: undefined,
          errors: errorMessages
        })
      }
    } else {
      console.error('ParseErrorTODO', {
        input,
        codeFragments,
        newInput,
        inputImagesWithoutSpace: inputImage,
        codeFragmentImage: image
      })
    }
  }

  const finalCodeFragments: CodeFragment[] = []

  const spaceCodeFragment: CodeFragment = {
    code: 'Space',
    name: ' ',
    spaceAfter: false,
    spaceBefore: false,
    type: 'any',
    render: undefined,
    errors: []
  }

  // TODO support space
  // let lastSpace = false
  codeFragments.forEach(codeFragment => {
    // if (codeFragment.spaceBefore && !lastSpace) {
    //   finalCodeFragments.push(spaceCodeFragment)
    // }

    finalCodeFragments.push(codeFragment)

    // if (codeFragment.spaceAfter) {
    //   finalCodeFragments.push(spaceCodeFragment)
    //   position += 1
    //   lastSpace = true
    // } else {
    //   lastSpace = false
    // }
  })

  const spaceCount = input.length - input.trimEnd().length
  if (spaceCount) {
    finalCodeFragments.push({ ...spaceCodeFragment, name: ' '.repeat(spaceCount) })
  }

  if (finalErrorMessages.length) {
    return {
      success: false,
      valid: finalErrorMessages[0].type !== 'parse' && codeFragments.length > 0,
      input: newInput,
      inputImage,
      parseImage: image,
      version,
      position,
      cst,
      level,
      errorType: 'syntax',
      completions,
      errorMessages: finalErrorMessages as [ErrorMessage, ...ErrorMessage[]],
      codeFragments: finalCodeFragments,
      variableDependencies,
      functionDependencies,
      blockDependencies,
      flattenVariableDependencies
    }
  }

  if ([...flattenVariableDependencies].find(v => v.namespaceId === namespaceId && v.variableId === variableId)) {
    return {
      success: false,
      valid: true,
      input: newInput,
      inputImage,
      position,
      parseImage: image,
      errorType: 'syntax',
      errorMessages: [{ message: 'Circular dependency found', type: 'circular_dependency' }],
      level,
      version,
      completions,
      cst,
      flattenVariableDependencies,
      variableDependencies,
      functionDependencies,
      blockDependencies,
      codeFragments: finalCodeFragments
    }
  }

  if (formulaContext.reservedNames.includes(name.toUpperCase())) {
    return {
      success: false,
      valid: true,
      input: newInput,
      inputImage,
      parseImage: image,
      cst,
      position,
      level,
      version,
      errorType: 'syntax',
      completions,
      errorMessages: [{ message: 'Variable name is reserved', type: 'name_check' }],
      flattenVariableDependencies,
      blockDependencies,
      variableDependencies,
      functionDependencies,
      codeFragments: finalCodeFragments
    }
  }

  const sameNameVariable = formulaContext
    .listVariables(namespaceId)
    .find(v => v.t.variableId !== variableId && v.t.name.toUpperCase() === name.toUpperCase())

  if (sameNameVariable) {
    return {
      success: false,
      valid: true,
      input: newInput,
      inputImage,
      parseImage: image,
      position,
      cst,
      level,
      version,
      errorType: 'syntax',
      completions,
      errorMessages: [{ message: 'Variable name exist in same namespace', type: 'name_unique' }],
      flattenVariableDependencies,
      blockDependencies,
      variableDependencies,
      functionDependencies,
      codeFragments: finalCodeFragments
    }
  }

  return {
    success: true,
    valid: true,
    input: newInput,
    inputImage,
    parseImage: image,
    position,
    cst,
    level,
    version,
    errorMessages: [],
    completions,
    kind: codeFragmentVisitor.kind,
    flattenVariableDependencies,
    blockDependencies,
    variableDependencies,
    functionDependencies,
    codeFragments: finalCodeFragments
  }
}

export const interpret = async ({ cst, ctx }: { cst: CstNode; ctx: FunctionContext }): Promise<InterpretResult> => {
  try {
    const interpreter = new FormulaInterpreter({ ctx })
    const result: AnyTypeResult = await interpreter.visit(cst, { type: 'any' })
    const lazy = interpreter.lazy

    return {
      lazy,
      variableValue: {
        success: true,
        updatedAt: new Date(),
        cacheValue: result,
        result
      }
    }
  } catch (e) {
    console.error(e)
    const message = `[FATAL] ${(e as any).message as string}`
    return {
      lazy: false,
      variableValue: {
        updatedAt: new Date(),
        success: false,
        cacheValue: { result: message, type: 'Error', errorKind: 'fatal' },
        result: { result: message, type: 'Error', errorKind: 'fatal' }
      }
    }
  }
}

export const buildVariable = ({
  formulaContext,
  meta: { name, input, namespaceId, variableId },
  view,
  parseResult: {
    valid,
    cst,
    kind,
    codeFragments,
    version,
    variableDependencies,
    functionDependencies,
    blockDependencies,
    level,
    flattenVariableDependencies
  },
  interpretResult: { variableValue, lazy }
}: {
  formulaContext: ContextInterface
  meta: VariableMetadata
  view: View
  parseResult: ParseResult
  interpretResult: InterpretResult
}): VariableInterface => {
  const t: VariableData = {
    namespaceId,
    variableId,
    name,
    cst,
    view,
    version: lazy ? -1 : version,
    codeFragments,
    definition: input,
    dirty: false,
    variableValue,
    valid,
    level,
    kind: kind ?? 'constant',
    variableDependencies,
    flattenVariableDependencies,
    blockDependencies,
    functionDependencies
  }

  const oldVariable = formulaContext.findVariable(namespaceId, variableId)
  if (oldVariable) {
    oldVariable.t = t
    return oldVariable
  } else {
    return new VariableClass({ t, formulaContext })
  }
}

export const appendFormulas = (formulaContext: ContextInterface, formulas: Formula[]): void => {
  const dupFormulas = [...formulas]
  dupFormulas
    .sort((a, b) => a.level - b.level)
    .forEach(formula => {
      const variable = castVariable(formulaContext, formula)

      void formulaContext.commitVariable({
        variable: new VariableClass({ t: variable, formulaContext }),
        skipCreate: true
      })
    })
}

// NOTE: only for test
export const quickInsert = async ({ ctx }: { ctx: FunctionContext }): Promise<void> => {
  const {
    formulaContext,
    meta: { namespaceId, variableId, name, input }
  } = ctx
  const view: View = {}

  const {
    success,
    cst,
    codeFragments,
    kind,
    level,
    version,
    errorMessages,
    variableDependencies,
    functionDependencies,
    blockDependencies,
    flattenVariableDependencies
  } = parse({ ctx })

  if (!success) {
    throw new Error(errorMessages[0]!.message)
  }

  const { variableValue, lazy } = await interpret({ cst: cst!, ctx })

  const variable: VariableData = {
    namespaceId,
    variableId,
    name,
    dirty: false,
    valid: true,
    view,
    definition: input,
    cst,
    version: lazy ? -1 : version,
    kind: kind ?? 'constant',
    codeFragments,
    variableValue,
    level,
    blockDependencies,
    variableDependencies,
    functionDependencies,
    flattenVariableDependencies
  }

  void (await formulaContext.commitVariable({ variable: new VariableClass({ t: variable, formulaContext }) }))
}
