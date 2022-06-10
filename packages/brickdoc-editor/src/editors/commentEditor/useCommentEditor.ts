import { useEditor, Editor, Content } from '@tiptap/react'
import { Base, BaseOptions } from '../../extensions/base'

export interface CommentEditorOptions {
  defaultContent?: Content
  mentionCommands: BaseOptions['mentionCommands']
}

export function useCommentEditor({ defaultContent, mentionCommands }: CommentEditorOptions): Editor | null {
  return useEditor({
    autofocus: 'end',
    content: defaultContent,
    extensions: [
      Base.configure({
        commandHelper: true,
        document: true,
        mentionCommands:
          typeof mentionCommands !== 'boolean'
            ? {
                size: 'sm',
                ...mentionCommands
              }
            : mentionCommands,
        pageLink: {
          size: 'sm'
        },
        paragraph: { native: true },
        text: true,
        user: {
          size: 'sm'
        }
      })
    ]
  })
}
