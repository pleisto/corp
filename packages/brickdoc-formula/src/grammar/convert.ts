import {
  ColumnCompletion,
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
  CodeFragment
} from '../types'
import { BlockType, ColumnType, SpreadsheetType } from '../controls'
import { BlockClass } from '../controls/block'

export const variableKey = (namespaceId: NamespaceId, variableId: VariableId): VariableKey =>
  `#${namespaceId}.${variableId}`

export const blockKey = (namespaceId: NamespaceId): BlockKey => `#${namespaceId}`

export const columnKey = (namespaceId: NamespaceId, columnId: ColumnId): ColumnKey => `#${namespaceId}.${columnId}`

const block2attrs = (block: BlockType): CodeFragmentAttrs => ({
  kind: 'Block',
  namespaceId: block.id,
  id: block.id,
  name: block.name()
})

const variable2attrs = (variable: VariableInterface): CodeFragmentAttrs => ({
  kind: 'Variable',
  namespaceId: variable.t.namespaceId,
  id: variable.t.variableId,
  name: variable.t.name
})

const spreadsheet2attrs = (spreadsheet: SpreadsheetType): CodeFragmentAttrs => ({
  kind: 'Spreadsheet',
  namespaceId: spreadsheet.blockId,
  id: spreadsheet.blockId,
  name: spreadsheet.name()
})

const column2attrs = (column: ColumnType): CodeFragmentAttrs => ({
  kind: 'Column',
  namespaceId: column.spreadsheet.blockId,
  id: column.columnId,
  name: column.name
})

export const block2codeFragment = (block: BlockType): CodeFragment => {
  return {
    display: block.name(),
    errors: [],
    wrapQuote: false,
    hide: false,
    value: blockKey(block.id),
    code: 'Block',
    type: 'any',
    attrs: block2attrs(block)
  }
}

export const variable2codeFragment = (variable: VariableInterface): CodeFragment => {
  return {
    display: variable.t.name,
    errors: [],
    value: variable.t.name,
    code: 'Variable',
    wrapQuote: true,
    hide: false,
    type: variable.t.variableValue.result.type,
    attrs: variable2attrs(variable)
  }
}

export const spreadsheet2codeFragment = (spreadsheet: SpreadsheetType): CodeFragment => {
  const value = blockKey(spreadsheet.blockId)
  return {
    display: spreadsheet.name(),
    errors: [],
    value,
    code: 'Spreadsheet',
    type: 'any',
    wrapQuote: false,
    hide: false,
    attrs: spreadsheet2attrs(spreadsheet)
  }
}

export const column2codeFragment = (column: ColumnType): CodeFragment => {
  const value = columnKey(column.namespaceId, column.columnId)
  return {
    display: column.name,
    errors: [],
    value,
    code: 'Column',
    type: 'any',
    wrapQuote: false,
    hide: false,
    attrs: column2attrs(column)
  }
}

export const block2name = (block: BlockType): BlockFormulaName => {
  return {
    kind: 'Block',
    name: block.name(),
    namespaceId: block.id,
    render: () => blockKey(block.id),
    prefixLength: () => 0,
    key: block.id
  }
}

export const variable2name = (variable: VariableInterface): VariableFormulaName => {
  const {
    t: { namespaceId, name, variableId }
  } = variable
  const render = (exist: boolean): string => (exist ? variableId : variableKey(namespaceId, variableId))
  const key = variableId
  return {
    kind: 'Variable',
    name,
    render,
    key,
    namespaceId,
    prefixLength: exist => (exist ? 0 : variable.namespaceName().length + 1)
  }
}

export const block2completion = (
  ctx: ContextInterface,
  { key, name }: BlockFormulaName,
  weight: number
): BlockCompletion => {
  const block = new BlockClass(ctx, { id: key })
  const value = blockKey(key)
  return {
    kind: 'block',
    weight: weight + 0,
    replacements: [name],
    positionChange: value.length,
    name,
    namespace: key,
    value,
    preview: block,
    renderDescription: blockId => '',
    codeFragments: [block2codeFragment(block)]
  }
}

export const spreadsheet2completion = (spreadsheet: SpreadsheetType): SpreadsheetCompletion => {
  const value = blockKey(spreadsheet.blockId)
  return {
    kind: 'spreadsheet',
    replacements: [spreadsheet.name()],
    weight: 10,
    name: spreadsheet.name(),
    positionChange: value.length,
    namespace: spreadsheet.blockId,
    value,
    preview: spreadsheet,
    renderDescription: blockId => '',
    codeFragments: [spreadsheet2codeFragment(spreadsheet)]
  }
}

export const column2completion = (column: ColumnType): ColumnCompletion => {
  const value = columnKey(column.namespaceId, column.columnId)
  return {
    kind: 'column',
    replacements: [
      `${blockKey(column.namespaceId)}.${column.name}`,
      `${blockKey(column.namespaceId)}.`,
      `${blockKey(column.namespaceId)}`,
      `${column.name}`
    ],
    weight: -3,
    name: column.name,
    positionChange: value.length,
    namespace: column.spreadsheet.name(),
    value,
    preview: column,
    renderDescription: blockId => column.spreadsheet.name(),
    codeFragments: [column2codeFragment(column)]
  }
}

export const variable2completion = (variable: VariableInterface, weight: number): VariableCompletion => {
  const name = variable.t.name
  const value: VariableKey = `${blockKey(variable.t.namespaceId)}.${name}`
  return {
    kind: 'variable',
    replacements: [`${blockKey(variable.t.namespaceId)}.`, blockKey(variable.t.namespaceId), variable.t.name, name],
    weight,
    name: variable.t.name,
    namespace: variable.namespaceName(),
    value,
    preview: variable,
    positionChange: value.length,
    renderDescription: blockId => (blockId === variable.t.namespaceId ? '' : variable.namespaceName()),
    codeFragments: [variable2codeFragment(variable)]
  }
}

export const function2completion = (functionClause: FunctionClause<any>, weight: number): FunctionCompletion => {
  const value: `${FunctionKey}()` = `${functionClause.key}()`
  return {
    kind: 'function',
    replacements: [functionClause.name],
    weight,
    name: functionClause.name,
    namespace: functionClause.group,
    value,
    preview: functionClause,
    positionChange: value.length - 1,
    renderDescription: blockId => (functionClause.group === 'core' ? '' : functionClause.group),
    codeFragments: [
      {
        display: value,
        errors: [],
        value,
        code: 'Function',
        type: 'any',
        wrapQuote: false,
        hide: false,
        attrs: undefined
      }
    ]
  }
}
