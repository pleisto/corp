import { Node } from 'prosemirror-model'
import { EditorOptions, Y } from '@brickdoc/editor'
import { Block } from '@brickdoc/schema'
import { DocMeta } from '@/docs/store/DocMeta'
import { useMentionCommands } from './useMentionCommands'
import { useEmbed } from './useEmbed'
import { useReactiveVar } from '@apollo/client'
import { FormulaContextVar } from '@/docs/reactiveVars'

export interface UseEditorOptions {
  docMeta: DocMeta
  blocks: Block[]
  documentEditable: boolean
  ydoc: Y.Doc | undefined
  onDocSave: (doc: Node) => Promise<void>
}

export function useEditorOptions({
  docMeta,
  documentEditable,
  blocks,
  ydoc,
  onDocSave
}: UseEditorOptions): EditorOptions {
  const mentionCommands = useMentionCommands(docMeta)
  const embed = useEmbed(blocks, docMeta)
  const formulaContext = useReactiveVar(FormulaContextVar)

  return {
    base: {
      collaboration: ydoc
        ? {
            document: ydoc
          }
        : false,
      embed,
      formula: {
        formulaContext
      },
      mentionCommands,
      sync: {
        onSave: onDocSave
      }
    },
    editable: documentEditable
  }
}
