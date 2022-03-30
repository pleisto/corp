import {
  ColumnId,
  ColumnKey,
  FunctionClause,
  FunctionCompletion,
  NamespaceId,
  SpreadsheetCompletion,
  BlockKey,
  VariableCompletion,
  VariableId,
  VariableInterface,
  VariableKey,
  BlockCompletion,
  BlockFormulaName,
  ContextInterface,
  FunctionKey,
  CodeFragmentAttrs,
  VariableFormulaName,
  CodeFragment,
  Completion,
  SpreadsheetKey,
  SpreadsheetFormulaName
} from '../types'
import { BlockType, ColumnType, SpreadsheetType } from '../controls'
import { BlockClass } from '../controls/block'
import { maybeEncodeString, reverseTraversalString } from './util'
import { fetchResult } from '../context'

export const variableKey = (namespaceId: NamespaceId, variableId: VariableId): VariableKey =>
  `#${namespaceId}.${variableId}`

export const blockKey = (namespaceId: NamespaceId): BlockKey => `#${namespaceId}`

export const currentBlockKey = (namespaceId: NamespaceId, pageId: NamespaceId): BlockKey =>
  namespaceId === pageId ? '#CurrentBlock' : blockKey(namespaceId)

export const columnKey = (namespaceId: NamespaceId, columnId: ColumnId): ColumnKey => `#${namespaceId}.${columnId}`

const block2attrs = (block: BlockType, pageId: NamespaceId): CodeFragmentAttrs => ({
  kind: 'Block',
  namespaceId: block.id,
  id: block.id,
  name: block.name(pageId)
})

export const variable2attrs = (variable: VariableInterface): CodeFragmentAttrs => ({
  kind: 'Variable',
  namespaceId: variable.t.namespaceId,
  id: variable.t.variableId,
  name: variable.t.name
})

const spreadsheet2attrs = (spreadsheet: SpreadsheetType): CodeFragmentAttrs => ({
  kind: 'Spreadsheet',
  namespaceId: spreadsheet.spreadsheetId,
  id: spreadsheet.spreadsheetId,
  name: spreadsheet.name()
})

export const column2attrs = (column: ColumnType): CodeFragmentAttrs => ({
  kind: 'Column',
  namespaceId: column.spreadsheet.spreadsheetId,
  id: column.columnId,
  name: column.name
})

export const block2codeFragment = (block: BlockType, pageId: NamespaceId): CodeFragment => {
  return {
    display: block.name(pageId),
    errors: [],
    hide: false,
    value: currentBlockKey(block.id, pageId),
    code: 'Block',
    type: 'Block',
    attrs: block2attrs(block, pageId)
  }
}

const variable2codeFragment = (variable: VariableInterface, pageId: NamespaceId): CodeFragment => {
  return {
    display: variable.t.name,
    errors: [],
    value: maybeEncodeString(variable.t.name)[1],
    code: 'Variable',
    hide: false,
    type: fetchResult(variable.t).type,
    attrs: variable2attrs(variable)
  }
}

export const block2name = (block: BlockType): BlockFormulaName => {
  return {
    kind: 'Block',
    name: block.name(''),
    namespaceId: block.id,
    renderTokens: (exist, pageId) => [
      { image: '#', type: 'Sharp' },
      pageId === block.id ? { image: 'CurrentBlock', type: 'CurrentBlock' } : { image: block.id, type: 'UUID' }
    ],
    key: block.id
  }
}

export const variable2name = (variable: VariableInterface): VariableFormulaName => {
  const {
    t: { namespaceId, name, variableId }
  } = variable
  const nameToken = { image: maybeEncodeString(name)[1], type: 'StringLiteral' }
  return {
    kind: 'Variable',
    name,
    renderTokens: (namespaceIsExist: boolean, pageId: NamespaceId) => {
      if (namespaceIsExist) {
        return [nameToken]
      }

      const namespaceToken =
        pageId === namespaceId ? { image: 'CurrentBlock', type: 'CurrentBlock' } : { image: namespaceId, type: 'UUID' }

      return [{ image: '#', type: 'Sharp' }, namespaceToken, { image: '.', type: 'Dot' }, nameToken]
    },
    key: variableId,
    namespaceId
  }
}

export const spreadsheet2name = (spreadsheet: SpreadsheetType): SpreadsheetFormulaName => {
  const nameToken = { image: maybeEncodeString(spreadsheet.name())[1], type: 'StringLiteral' }
  return {
    kind: 'Spreadsheet',
    name: spreadsheet.name(),
    namespaceId: spreadsheet.namespaceId,
    renderTokens: (namespaceIsExist, pageId) => {
      if (namespaceIsExist) {
        return [nameToken]
      }

      const namespaceToken =
        pageId === spreadsheet.namespaceId
          ? { image: 'CurrentBlock', type: 'CurrentBlock' }
          : { image: spreadsheet.namespaceId, type: 'UUID' }

      return [{ image: '#', type: 'Sharp' }, namespaceToken, { image: '.', type: 'Dot' }, nameToken]
    },
    key: spreadsheet.spreadsheetId
  }
}

export const block2completion = (
  ctx: ContextInterface,
  { key, name }: BlockFormulaName,
  pageId: NamespaceId
): BlockCompletion => {
  const block = new BlockClass(ctx, { id: key })
  const value = currentBlockKey(key, pageId)
  return {
    kind: 'block',
    weight: key === pageId ? 1 : -1,
    replacements: [value, ...reverseTraversalString(name)],
    positionChange: value.length,
    name,
    namespace: key,
    value,
    preview: block,
    codeFragments: [block2codeFragment(block, pageId)]
  }
}

export const spreadsheet2completion = (spreadsheet: SpreadsheetType, pageId: NamespaceId): SpreadsheetCompletion => {
  const namespaceKey = currentBlockKey(spreadsheet.namespaceId, pageId)
  const value: SpreadsheetKey = `${namespaceKey}.${spreadsheet.name()}`
  return {
    kind: 'spreadsheet',
    replacements: [...reverseTraversalString(value, namespaceKey.length)],
    weight: 10,
    name: spreadsheet.name(),
    positionChange: value.length,
    namespace: spreadsheet.spreadsheetId,
    value,
    preview: spreadsheet,
    codeFragments: [
      {
        display: spreadsheet.name(),
        errors: [],
        value,
        code: 'Spreadsheet',
        type: 'Spreadsheet',
        hide: false,
        attrs: spreadsheet2attrs(spreadsheet)
      }
    ]
  }
}

export const variable2completion = (variable: VariableInterface, pageId: NamespaceId): VariableCompletion => {
  const name = variable.t.name
  const namespaceKey = currentBlockKey(variable.t.namespaceId, pageId)
  const value: VariableKey = `${namespaceKey}.${name}`
  const namespaceName = variable.namespaceName(pageId)
  const codeFragment = variable2codeFragment(variable, pageId)
  return {
    kind: 'variable',
    replacements: [...reverseTraversalString(value, namespaceKey.length), ...reverseTraversalString(name)],
    weight: variable.t.namespaceId === pageId ? 1 : -1,
    name: variable.t.name,
    namespace: namespaceName,
    value,
    preview: variable,
    positionChange: value.length,
    codeFragments: [{ ...codeFragment, value: `${namespaceKey}.${codeFragment.value}` }]
  }
}

export const function2completion = (functionClause: FunctionClause<any>, weight: number): FunctionCompletion => {
  const value: `${FunctionKey}()` = `${functionClause.key}()`
  return {
    kind: 'function',
    replacements: reverseTraversalString(value),
    weight,
    name: functionClause.name,
    namespace: functionClause.group,
    value,
    preview: functionClause,
    positionChange: value.length - 1,
    codeFragments: [
      {
        display: value,
        errors: [],
        value,
        code: 'Function',
        type: 'any',
        hide: false,
        attrs: undefined
      }
    ]
  }
}

export const attrs2completion = (
  formulaContext: ContextInterface,
  { kind, id, namespaceId }: CodeFragmentAttrs,
  pageId: string
): Completion | undefined => {
  if (kind === 'Variable') {
    const variable = formulaContext.findVariableById(namespaceId, id)
    if (!variable) return undefined
    return variable2completion(variable, pageId)
  }

  // if (kind === 'Spreadsheet') {
  //   const spreadsheet = formulaContext.findSpreadsheetById(id)
  //   if (!spreadsheet) return undefined
  //   return spreadsheet2completion(spreadsheet, pageId)
  // }

  return undefined
}
