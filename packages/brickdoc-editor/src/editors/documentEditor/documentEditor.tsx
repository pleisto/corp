import { useMemo, FC, useEffect } from 'react'
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
import { DiscussionList, ExplorerMenu, HistoryList } from '../../components/editorViews'
import { BubbleMenu } from '../../components/extensionViews'
import {
  Blockquote,
  BulletList,
  CodeBlock,
  Embed,
  Formula,
  HardBreak,
  Heading,
  HorizontalRule,
  Image,
  ListItem,
  OrderedList,
  Paragraph,
  Spreadsheet,
  SubPageMenu,
  TaskItem,
  TaskList,
  Toc
} from '../../extensions'
import { Base, BaseOptions } from '../../extensions/base'
import { useDrawerService } from '../../components/ui/Drawer'
import { useDropBlock, useUndo } from '../../helpers'
import { documentEditorStyles } from './styles'
import { EditorProps, useEditorPropsEffect } from '../../context'
import { merge } from 'lodash'

export interface EditorContentProps extends EditorProps {
  editor: TiptapEditor | null
}

export const EditorContent: FC<EditorContentProps> = ({ editor, ...props }) => {
  documentEditorStyles()

  const editorContext = useMemo<EditorContextData>(
    () => ({ editor, documentEditable: props.documentEditable }),
    [editor, props.documentEditable]
  )
  useEditorI18n()
  useDrawerService()
  useDropBlock(editor)
  useUndo(editor)
  useEditorPropsEffect(props)

  return (
    <EditorContext.Provider value={editorContext}>
      <BubbleMenu editor={editor} />
      <TiptapEditorContent className="brickdoc" editor={editor} />
      <DiscussionList />
      <HistoryList docId={props.rootId} domain={props.domain} historyId={props.historyId} navigate={props.navigate} />
      <ExplorerMenu editor={editor} />
    </EditorContext.Provider>
  )
}

export interface EditorOptions extends Partial<TiptapEditorOptions> {
  baseExtensionOptions?: Partial<BaseOptions>
  props: EditorProps
  ydoc?: Y.Doc
}

const typesWithUuid = [
  Blockquote.name,
  BulletList.name,
  CodeBlock.name,
  Embed.name,
  Formula.name,
  HardBreak.name,
  Heading.name,
  HorizontalRule.name,
  Image.name,
  ListItem.name,
  TaskItem.name,
  TaskList.name,
  OrderedList.name,
  Paragraph.name,
  SubPageMenu.name,
  Toc.name,
  Spreadsheet.name
]

export function useEditor(options: EditorOptions): TiptapEditor | null {
  const { editable, props, ydoc, baseExtensionOptions, ...restOptions } = options

  const editorOptions = useMemo<Partial<TiptapEditorOptions>>(
    () => ({
      extensions: [
        Base.configure(
          merge(baseExtensionOptions, {
            anchor: true,
            blockquote: true,
            bold: true,
            brickList: true,
            bulletList: true,
            commandHelper: true,
            code: true,
            codeBlock: true,
            document: true,
            discussion: true,
            dropcursor: {
              color: theme.colors.primaryDisable.value,
              width: 2
            },
            embed: true,
            eventHandler: true,
            fontColor: true,
            fontBgColor: true,
            formula: true,
            gapcursor: false,
            hardBreak: true,
            heading: true,
            history: true,
            horizontalRule: true,
            indent: true,
            image: true,
            italic: true,
            keyboardShortcut: true,
            link: {
              autolink: false
            },
            listItem: true,
            mentionCommands: {
              editorProps: props
            },
            orderedList: true,
            pageLink: true,
            paragraph: true,
            slashCommands: true,
            spreadsheet: true,
            strike: true,
            subPageMenu: true,
            sync: {
              types: typesWithUuid
            },
            taskItem: {
              nested: true
            },
            taskList: true,
            text: true,
            textStyle: true,
            toc: true,
            underline: true,
            uniqueID: {
              attributeName: 'uuid',
              types: typesWithUuid
            },
            user: true,
            collaboration: ydoc
              ? {
                  document: ydoc
                }
              : false,
            dropBlock: true
          })
        )
      ],
      autofocus: true,
      editable,
      ...restOptions
    }),
    [baseExtensionOptions, editable, props, restOptions, ydoc]
  )

  const editor = useTiptapEditor(editorOptions, [])

  useEffect(() => {
    editor?.setOptions(editorOptions)
  }, [editor, editorOptions])

  return editor
}
