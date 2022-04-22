import React from 'react'
import { Button, Popover, Icon } from '@brickdoc/design-system'
import styles from './DocumentTitle.module.less'
import * as Root from './DocumentTitle.style'
import { TEST_ID_ENUM } from '@brickdoc/test-helper'
import { DocumentIcon, DocumentIconMeta } from './DocumentIcon'
import { DocumentCover, DocumentCoverMeta } from './DocumentCover'
import { useDocsI18n } from '../../../common/hooks'
import {
  useDocumentIconUploader,
  useDocumentCoverUploader,
  usePrepareFileUpload,
  useFetchUnsplashImages
} from '../../hooks'
import { useReactiveVar } from '@apollo/client'
import { editorVar } from '@/docs/reactiveVars'
import { useBlobGetter } from '../../hooks/useBlobGetter'
import { GetChildrenBlocksQuery } from '@/BrickdocGraphQL'
import { Document, DocumentMeta } from '@/common/models'
// import { EditorContentProps } from '@brickdoc/editor'

export interface DocumentTitleProps {
  document?: Document
  saveDocument: (doc: Document) => void
  docId?: string
  blocks: GetChildrenBlocksQuery['childrenBlocks']
  editable: boolean
}

export const DocumentTitle: React.FC<DocumentTitleProps> = ({ document, saveDocument, docId, editable, blocks }) => {
  const { t } = useDocsI18n()
  const editor = useReactiveVar(editorVar)
  const blockId = editor?.state.doc.attrs.uuid

  const [meta, setMeta] = React.useState<DocumentMeta>(document?.meta ?? {})

  const { icon, cover, title } = meta

  const changeDocMeta = React.useCallback(
    (newMeta: { [key: string]: any }) => {
      setMeta(newMeta)
      saveDocument({ ...document, meta: { ...meta, ...newMeta } })
    },
    [document, meta, saveDocument]
  )

  const createDocAttrsUpdater = React.useCallback(
    (field: string) => {
      return (value: any): void => {
        changeDocMeta({ ...meta, [field]: value })
      }
    },
    [changeDocMeta, meta]
  )

  const docIconGetter = useBlobGetter('icon', blocks)
  const docCoverGetter = useBlobGetter('cover', blocks)

  const setTitle = createDocAttrsUpdater('title')
  const setIcon = createDocAttrsUpdater('icon')
  const setCover = createDocAttrsUpdater('cover')

  const getDocIconUrl = (): string | undefined => {
    if (!editor || editor.isDestroyed) return undefined
    return docIconGetter(editor.state.doc)
  }
  const getDocCoverUrl = (): string | undefined => {
    if (!editor || editor.isDestroyed) return undefined
    return docCoverGetter(editor.state.doc)
  }

  const prepareFileUpload = usePrepareFileUpload()
  const fetchUnsplashImages = useFetchUnsplashImages()
  const [localIcon, setLocalIcon] = React.useState('')
  const [localCover, setLocalCover] = React.useState('')
  const [documentIconMeta, iconPopoverProps] = useDocumentIconUploader(icon as DocumentIconMeta, {
    blockId,
    prepareFileUpload,
    fetchUnsplashImages,
    styles,
    onChange: setIcon,
    onFileLoaded: setLocalIcon
  })
  const [documentCoverMeta, coverPopoverProps] = useDocumentCoverUploader(cover as DocumentCoverMeta, {
    blockId,
    prepareFileUpload,
    fetchUnsplashImages,
    styles,
    onChange: setCover,
    onFileLoaded: setLocalCover
  })

  return (
    <>
      <DocumentCover
        editable={editable}
        localUrl={localCover}
        getDocCoverUrl={getDocCoverUrl}
        documentCoverMeta={documentCoverMeta}
        popoverProps={coverPopoverProps}
      />

      <Root.TitleWrapper
        width={{
          '@smDown': 'sm'
        }}
      >
        <Root.MaxWidth>
          {editable && (
            <Root.Actions data-testid={TEST_ID_ENUM.page.DocumentPage.actionButtons.id}>
              {!documentIconMeta && (
                <Popover {...iconPopoverProps}>
                  <Root.Item as={Button} type="unstyled" disabled={!editable}>
                    <Root.Icon as={Icon.Face} />
                    <Root.Name>{t('title.add_icon')}</Root.Name>
                  </Root.Item>
                </Popover>
              )}
              {!documentCoverMeta && (
                <Popover {...coverPopoverProps}>
                  <Root.Item
                    as={Button}
                    data-testid={TEST_ID_ENUM.page.DocumentPage.coverButton.id}
                    type="unstyled"
                    disabled={!editable}
                  >
                    <Root.Icon as={Icon.Image} />
                    <Root.Name>{t('title.add_cover')}</Root.Name>
                  </Root.Item>
                </Popover>
              )}
            </Root.Actions>
          )}
          <Root.TitleRow>
            {documentIconMeta && (
              <Popover {...iconPopoverProps} visible={!editable ? false : undefined}>
                <DocumentIcon getDocIconUrl={getDocIconUrl} localUrl={localIcon} documentIconMeta={documentIconMeta} />
              </Popover>
            )}
            <Root.Input
              type="text"
              bordered={false}
              value={title as string}
              data-testid={TEST_ID_ENUM.page.DocumentPage.titleInput.id}
              onChange={(e: any) => {
                setTitle(e.target.value)
              }}
              placeholder={t('title.untitled')}
              disabled={!editable}
            />
          </Root.TitleRow>
        </Root.MaxWidth>
      </Root.TitleWrapper>
    </>
  )
}
