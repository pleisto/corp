import React, { useEffect } from 'react'
import { Spin, devLog } from '@brickdoc/design-system'
import { EditorContent, useEditor, useEditorI18n } from '@brickdoc/editor'
import { Block } from '@/BrickdocGraphQL'
import { DocumentTitle } from './components/DocumentTitle'
import { useDocSyncProvider } from './hooks'
import { useDocument } from '@/common/models'
import { blocksToJSONContents } from '../common/blocks'
import { JSONContent } from '@tiptap/core'
import { TrashPrompt } from '../common/components/TrashPrompt'
import { Navigate } from 'react-router-dom'
import { DocMeta, NonNullDocMeta } from './DocumentContentPage'
import { editorVar } from '../reactiveVars'
import { useEditorExternalProps } from './hooks/useEditorExternalProps'
import { useDocumentEditable } from './hooks/useDocumentEditable'
import * as Root from './DocumentPage.style'

interface DocumentPageProps {
  docMeta: DocMeta
  // default: user can edit/view document normally
  // presentation: just for viewing and can not edit it.
  mode?: 'default' | 'presentation'
}

export const DocumentPage: React.FC<DocumentPageProps> = ({ docMeta, mode }) => {
  // apollo doesn't work well with React Suspense. We must place this suspense-related hook above
  // apollo useQuery API to avoid issues like sending request twice.
  // useEditorI18n() is called inside useEditor(), which is below useGetChildrenBlocksQuery(). So we
  // promote this call to the beginning of this render fn.
  useEditorI18n()

  const { document, loading, rootBlock, onDocSave, saveDocument } = useDocument({ docId: docMeta.id as string })

  const { ydoc, initBlocksToEditor } = useDocSyncProvider({ docId: docMeta.id as string })

  const freeze = mode === 'presentation'
  const currentRootBlock = rootBlock.current
  const [documentEditable] = useDocumentEditable(freeze ?? false, docMeta, currentRootBlock)

  // TODO: refactor editor and editable reactive var
  // const documentEditable = !freeze

  const externalProps = useEditorExternalProps({
    docMeta,
    documentEditable,
    blocks: document?.blocks ?? []
  })

  const editor = useEditor({
    onSave: onDocSave,
    externalProps,
    editable: documentEditable,
    ydoc: ydoc.current
  })

  // TODO: refactor editor reactive var
  useEffect(() => {
    editorVar(freeze ? null : editor)
  }, [editor, freeze])

  useEffect(() => {
    if (editor && !editor.isDestroyed && document?.blocks && initBlocksToEditor.current) {
      devLog('init blocks to editor')
      const content: JSONContent[] = blocksToJSONContents(document?.blocks as Block[])

      if (content.length) {
        editor.chain().setMeta('preventUpdate', true).replaceRoot(content[0]).run()
      }
    }
  }, [editor, document?.blocks, initBlocksToEditor])

  if (loading || docMeta.documentInfoLoading) {
    return (
      <Root.PageSpinWrapper>
        <Spin size="lg" />
      </Root.PageSpinWrapper>
    )
  }

  const redirectPersonalSpacePath = `/${docMeta.personalDomain}`

  if (!document) {
    return null
  }

  if (!docMeta.viewable || (docMeta.isAnonymous && !document?.blocks?.length)) {
    return <Navigate to={redirectPersonalSpacePath} />
    // return <Alert message="TODO Page not found" type="error" />
  }

  const PageElement = (
    <>
      {docMeta.id && docMeta.isDeleted && <TrashPrompt docMeta={docMeta as NonNullDocMeta} />}
      <Root.Page
        width={{
          '@mdOnly': 'md',
          '@smDown': 'sm'
        }}
      >
        <DocumentTitle
          document={document}
          saveDocument={saveDocument}
          docId={docMeta.id}
          blocks={document?.blocks}
          editable={documentEditable}
        />
        <Root.PageContent>
          <EditorContent editor={editor} externalProps={externalProps} />
        </Root.PageContent>
      </Root.Page>
    </>
  )

  if (!docMeta.id) {
    return PageElement
  }

  if (document?.blocks?.length) {
    return PageElement
  } else {
    return <Navigate to={redirectPersonalSpacePath} />
  }
}
