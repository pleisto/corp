import { CodeFragment, FormulaCodeFragmentAttrs } from '@brickdoc/formula'
import { JSONContent } from '@tiptap/core'

export const codeFragmentsToJSONContentTotal = (
  codeFragments: CodeFragment[] | undefined,
  blockId: string
): JSONContent | undefined => {
  if (!codeFragments) return undefined
  if (codeFragments.length === 0) return undefined

  const content: JSONContent[] = []

  codeFragments.forEach(codeFragment => {
    content.push(...codeFragmentToJSONContentArray(codeFragment, blockId))
  })

  const jsonContent = { type: 'doc', content: [{ type: 'paragraph', content }] }
  return jsonContent
}

export const codeFragmentToJSONContentArray = (codeFragment: CodeFragment, blockId: string): JSONContent[] => {
  const result: JSONContent[] = []

  if (codeFragment.render) {
    const attrs = codeFragment.render(blockId)
    attrs.forEach(a => result.push(attrsToJSONContent(a)))
  } else {
    result.push(
      attrsToJSONContent({
        display: codeFragment.name,
        value: codeFragment.name,
        code: codeFragment.code,
        type: codeFragment.type,
        error: codeFragment.errors.length === 0 ? '' : codeFragment.errors[0].message
      })
    )
  }

  return result
}

const attrsToJSONContent = (attrs: FormulaCodeFragmentAttrs): JSONContent => {
  return { type: 'text', text: attrs.display, marks: [{ type: 'FormulaType', attrs }] }
}

export const contentToInput = (content: JSONContent): string => {
  const input = content.content?.map((c: JSONContent) => JSONContentToText(c)).join('') ?? ''
  // console.log({ content, input })
  return input
}

export const JSONContentToText = (c: JSONContent): string => {
  if (c.type !== 'text') {
    console.error('JSONContentToText: not text', c)
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
    console.error('JSONContentToText: not FormulaType', c)
    return text
  }

  const attrs: FormulaCodeFragmentAttrs | undefined = mark.attrs as FormulaCodeFragmentAttrs

  if (!attrs) {
    console.error('JSONContentToText: no attrs', c)
    return text
  }

  if (attrs.display !== text) {
    return text
  }

  return attrs.value
}
