import React from 'react'
import { useEditor, EditorContent, EditorOptions } from '@tiptap/react'
import { BasicRichtextExtension, SlashCommandsExtension, BlockCommandsExtension, SyncExtension, SyncCallback } from './extensions'
import './styles.less'

export interface EditorProps {
  options?: Partial<EditorOptions>
  syncCallback: SyncCallback
}

export const Editor: React.FC<EditorProps> = (props: EditorProps) => {
  const editor = useEditor({
    ...props.options,
    extensions: [
      BasicRichtextExtension,
      BlockCommandsExtension,
      SlashCommandsExtension,
      SyncExtension.configure({ callback: props.syncCallback })
    ],
    autofocus: true
  })
  return <EditorContent style={{ minHeight: '100vh' }} editor={editor} />
}
