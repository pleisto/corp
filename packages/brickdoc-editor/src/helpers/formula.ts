import { CodeFragment } from '@brickdoc/formula'
import { JSONContent } from '@tiptap/core'
import { devWarning } from '@brickdoc/design-system'

export const buildJSONContentByDefinition = (definition: string | undefined): JSONContent | undefined => {
  if (!definition) {
    return undefined
  }

  return buildJSONContentByArray([{ type: 'text', text: definition }])
}

export const maybeRemoveDefinitionEqual = (definition: string | undefined, formulaIsNormal: boolean): string => {
  if (!definition) {
    return ''
  }

  if (!formulaIsNormal) {
    return definition
  }

  if (definition.startsWith('=')) {
    return definition.substring(1)
  }

  return definition
}

export const maybeRemoveCodeFragmentsEqual = (
  codeFragments: CodeFragment[] | undefined,
  formulaIsNormal: boolean
): CodeFragment[] => {
  if (!codeFragments?.length) {
    return []
  }

  if (!formulaIsNormal) {
    return codeFragments
  }

  const firstCodeFragment = codeFragments[0]

  if (firstCodeFragment.code === 'Equal') {
    return codeFragments.slice(1)
  }

  return codeFragments
}

export const buildJSONContentByArray = (content: JSONContent[]): JSONContent => {
  return { type: 'doc', content: [{ type: 'paragraph', content }] }
}

export const fetchJSONContentArray = (content: JSONContent | undefined): JSONContent[] => {
  return content?.content?.[0]?.content ?? []
}

export const codeFragmentsToJSONContentTotal = (codeFragments: CodeFragment[] | undefined): JSONContent | undefined => {
  if (!codeFragments) return undefined
  if (codeFragments.length === 0) return undefined

  return buildJSONContentByArray(codeFragmentsToJSONContentArray(codeFragments))
}

export const codeFragmentsToJSONContentArray = (codeFragments: CodeFragment[]): JSONContent[] => {
  const result: JSONContent[] = []

  codeFragments.forEach(codeFragment => {
    const attr = attrsToJSONContent(codeFragment)
    if (codeFragment.display) {
      result.push(attr)
    }
  })

  return result
}

export const attrsToJSONContent = (attrs: CodeFragment): JSONContent => {
  return { type: 'text', text: attrs.display, marks: [{ type: 'FormulaType', attrs }] }
}

export const positionBasedContentArrayToInput = (
  content: JSONContent[],
  position: number
): { prevText: string; nextText: string } => {
  const prevTexts: string[] = []
  const nextTexts: string[] = []
  let input = ''

  content.forEach((c: JSONContent) => {
    const text = JSONContentToText(c)
    input = input.concat(c.text ?? '')
    if (input.length > position) {
      nextTexts.push(text)
    } else {
      prevTexts.push(text)
    }
  })

  // devLog({ prevTexts, nextTexts, input, position, content })
  return { prevText: prevTexts.join(''), nextText: nextTexts.join('') }
}

export const contentArrayToInput = (content: JSONContent[]): string => {
  const input = content.map((c: JSONContent) => JSONContentToText(c)).join('') ?? ''
  devWarning(true, 'contentArrayToInput', { content, input })
  return input
}

const JSONContentToText = (c: JSONContent): string => {
  if (c.type !== 'text') {
    devWarning(true, 'JSONContentToText: not text', c)
    return ''
  }

  const text = c.text ?? ''

  if (!c.marks) {
    return text
  }

  const mark = c.marks[0]

  if (!mark) {
    return text
  }

  if (mark.type !== 'FormulaType') {
    devWarning(true, 'JSONContentToText: not FormulaType', c)
    return text
  }

  const attrs: CodeFragment | undefined = mark.attrs as CodeFragment

  if (!attrs) {
    devWarning(true, 'JSONContentToText: no attrs', c)
    return text
  }

  if (attrs.display === text) {
    return attrs.value
  }

  return text
}
