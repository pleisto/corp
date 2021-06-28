import React from 'react'
import { useEditor, EditorContent, EditorOptions } from '@tiptap/react'
import { BasicRichtextExtension, SlashMenuExtension, SyncExtension, CollabNetworkAdapter } from './extensions'
import './styles.less'

export interface EditorProps {
  options?: Partial<EditorOptions>
  provider?: CollabNetworkAdapter
}

export const Editor: React.FC<EditorProps> = props => {
  const editor = useEditor({
    ...props.options,
    extensions: [BasicRichtextExtension, SlashMenuExtension, SyncExtension.configure({ provider: props.provider })],
    autofocus: true
  })
  return <EditorContent style={{ minHeight: '100vh' }} editor={editor} />
}
