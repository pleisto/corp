import React from 'react'
import cx from 'classnames'
import { Icon } from '@brickdoc/design-system'
import { FileType } from '../../helpers/file'
import IconPdf from '../../../assets/file-pdf.png'

interface FileIconProps {
  fileType: FileType
  className?: string
}

export const FileIcon: React.FC<FileIconProps> = ({ fileType, className }) => {
  if (fileType === 'image') return <Icon.Image className={cx('brickdoc-link-block-attachment-cion', className)} />
  if (fileType === 'pdf') return <img className={cx('brickdoc-link-block-attachment-img-icon', className)} alt="" src={IconPdf} />
  return <Icon.PaperClip className={cx('brickdoc-link-block-attachment-icon', className)} />
}
