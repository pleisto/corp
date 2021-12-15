import React, { useEffect } from 'react'
import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Paragraph from '@tiptap/extension-paragraph'
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import { CodeFragmentBlockExtension } from './extensions/codeFragment'
import { HandleKeyDownExtension, KeyDownHandlerType } from './extensions/handleKeyDown'
import './FormulaEditor.less'

export interface FormulaEditorProps {
  content: JSONContent | undefined
  editable: boolean
  position?: number
  updateContent?: (editor: Editor) => void
  updatePosition?: (position: number) => void
  keyDownHandler?: KeyDownHandlerType
}

const findNearestWord = (content: string, targetIndex: number): string | undefined =>
  content.split(' ').find((word, index) => index + word.length >= targetIndex)

export const FormulaEditor: React.FC<FormulaEditorProps> = ({
  content,
  editable,
  position: pos,
  updateContent,
  updatePosition,
  keyDownHandler
}) => {
  const editor = useEditor({
    editable,
    extensions: [Document, Text, Paragraph, CodeFragmentBlockExtension, HandleKeyDownExtension(keyDownHandler)],
    onUpdate: ({ editor, transaction }) => {
      updateContent?.(editor)
      if (transaction.selection.from === transaction.selection.to) {
        const position = transaction.selection.from - 1

        updatePosition?.(position + 1)

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

            const word = findNearestWord(block.text!, position - length - 1)
            console.log({ word, pos: position - length - 1 })
          }

          length += blockLength
        }
      }
    }
  })

  useEffect(() => {
    if (editor && !editor.isDestroyed && content) {
      editor.commands.replaceRoot(content)

      if (pos) {
        console.log({ pos })
        editor.commands.setTextSelection(pos)
      }
      // console.log({ content, editor, label: 'after replace root' })
    }
  }, [editor, content, pos])

  return (
    <>
      <EditorContent className="brickdoc-formula-editor" editor={editor} />
    </>
  )
}
