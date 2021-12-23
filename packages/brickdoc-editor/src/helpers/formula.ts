import { CodeFragment, FormulaCodeFragmentAttrs } from '@brickdoc/formula'
import { JSONContent } from '@tiptap/core'

const spaceContent: JSONContent = { type: 'text', text: ' ' }

export const codeFragmentsToJSONContentTotal = (
  codeFragments: CodeFragment[] | undefined,
  blockId: string
): JSONContent | undefined => {
  if (!codeFragments) return undefined
  if (codeFragments.length === 0) return undefined

  const content: JSONContent[] = []
  let lastSpace = false

  codeFragments.forEach(codeFragment => {
    if (codeFragment.spaceBefore && !lastSpace) {
      content.push(spaceContent)
    }
    content.push(...codeFragmentToJSONContentArray(codeFragment, blockId))
    if (codeFragment.spaceAfter) {
      content.push(spaceContent)
      lastSpace = true
    }
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
  // const input = content.content?.map((c: JSONContent) => c.marks?.[0]?.attrs?.value || c.text || '').join('') ?? ''
  return (
    content.content?.map((c: JSONContent) => (c.type === 'text' ? c.text : c.content?.[0].text ?? '')).join('') ?? ''
  )
}
