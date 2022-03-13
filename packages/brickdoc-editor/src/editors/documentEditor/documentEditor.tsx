import { useMemo } from 'react'
import {
  useEditor as useTiptapEditor,
  EditorContent as TiptapEditorContent,
  Editor as TiptapEditor
} from '@tiptap/react'
import { EditorOptions as TiptapEditorOptions } from '@tiptap/core'
import * as Y from 'yjs'
import { theme } from '@brickdoc/design-system'
import { useEditorI18n } from '../../hooks'
import { EditorContext, EditorContextData } from '../../context/EditorContext'
import { DiscussionList, ExplorerMenu } from '../../components/editorViews'
import { BubbleMenu } from '../../components/extensionViews'
import { SyncOptions } from '../../extensions'
import { Base } from '../../extensions/base'
import { ExternalProps, ExternalPropsContext } from '../../context'
import './styles.less'

export interface EditorContentProps {
  editor: TiptapEditor | null
  externalProps: ExternalProps
}

export const EditorContent: React.FC<EditorContentProps> = ({ editor, externalProps }) => {
  const [t] = useEditorI18n()
  const editorContext = useMemo<EditorContextData>(() => ({ editor, t }), [editor, t])
  return (
    <EditorContext.Provider value={editorContext}>
      <ExternalPropsContext.Provider value={externalProps}>
        <BubbleMenu editor={editor} />
        <TiptapEditorContent className="brickdoc" editor={editor} />
        <DiscussionList />
        <ExplorerMenu />
      </ExternalPropsContext.Provider>
    </EditorContext.Provider>
  )
}

export interface EditorOptions extends Partial<TiptapEditorOptions> {
  externalProps: ExternalProps
  onSave: SyncOptions['onSave']
  ydoc?: Y.Doc
}

const typesWithUuid = [
  'blockquote',
  'bulletList',
  'codeBlock',
  'embedBlock',
  'formulaBlock',
  'hardBreak',
  'heading',
  'horizontalRule',
  'imageBlock',
  'listItem',
  'orderedList',
  'paragraph',
  'subPageMenuBlock',
  'tocBlock',
  'spreadsheetBlock'
]

export function useEditor(options: EditorOptions): TiptapEditor | null {
  const { onSave, editable, externalProps, ydoc, ...restOptions } = options

  const editor = useTiptapEditor(
    {
      extensions: [
        Base.configure({
          all: true,
          dropcursor: {
            color: theme.colors.primaryDisable.value,
            width: 2
          },
          gapcursor: false,
          link: {
            autolink: false
          },
          mentionCommands: {
            externalProps
          },
          sync: {
            onSave,
            types: typesWithUuid
          },
          uniqueID: {
            attributeName: 'uuid',
            types: typesWithUuid
          },
          collaboration: ydoc
            ? {
                document: ydoc
              }
            : false
        })
      ],
      autofocus: true,
      editable,
      ...restOptions
    },
    [ydoc]
  )

  return editor
}
