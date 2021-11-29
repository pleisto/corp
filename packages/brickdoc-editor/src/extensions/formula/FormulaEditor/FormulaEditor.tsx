import React from 'react'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Paragraph from '@tiptap/extension-paragraph'
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import { FunctionCallBlockExtension } from './extensions/functionCall'
import { DisableNewLineExtension } from './extensions/disableNewLine'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FormulaEditorProps {}

const findNearestWord = (content: string, targetIndex: number): string | undefined =>
  content.split(' ').find((word, index) => index + word.length >= targetIndex)

export const FormulaEditor: React.FC<FormulaEditorProps> = () => {
  const editor = useEditor({
    extensions: [Document, Text, Paragraph, FunctionCallBlockExtension, DisableNewLineExtension],
    content: '<p>123<function-call></function-call></p>',
    onUpdate: ({ editor, transaction }) => {
      if (transaction.selection.from === transaction.selection.to) {
        const position = transaction.selection.from - 1

        if (position < 1) return
        const blocks: JSONContent[] = editor.getJSON().content[0].content
        let length = 0

        for (const block of blocks) {
          let blockLength = 0
          if (block.type === 'text') {
            blockLength = block.text?.length ?? 0
          } else {
            blockLength = 1
          }

          // matched
          if (length + blockLength >= position) {
            if (block.type !== 'text') break

            console.log(position - length - 1)
            const word = findNearestWord(block.text!, position - length - 1)
            console.log(word)
          }

          length += blockLength
        }
      }
    }
  })

  return (
    <>
      <EditorContent editor={editor} />
      <div> auto complete </div>
    </>
  )
}
