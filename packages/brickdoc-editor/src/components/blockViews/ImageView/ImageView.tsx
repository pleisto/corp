import * as React from 'react'
import { linkStorage } from '../../../helpers/file'
import 'react-medium-image-zoom/dist/styles.css'
import './styles.less'
import { getBlobUrl } from '../../../helpers/getBlobUrl'
import { EditorDataSourceContext } from '../../../dataSource/DataSource'
import { UploaderMode } from './modes/UploaderMode'
import { PreviewMode } from './modes/PreviewMode'
import { ImageAttributes, ImageViewProps } from '../../../extensions/blocks/image/meta'

// TODO: handle image load on error
export const ImageView: React.FC<ImageViewProps> = ({ node, deleteNode, getPos, updateAttributes }) => {
  const editorDataSource = React.useContext(EditorDataSourceContext)
  const latestImageAttributes = React.useRef<Partial<ImageAttributes['image']>>({})
  const updateImageAttributes = React.useCallback(
    (newAttributes: Partial<ImageAttributes['image']>): void => {
      latestImageAttributes.current = {
        ...latestImageAttributes.current,
        ...newAttributes
      }

      if (!node.attrs.image?.source && !latestImageAttributes.current.source) {
        return
      }

      updateAttributes({
        image: {
          ...node.attrs.image,
          ...latestImageAttributes.current
        }
      })
    },
    [node.attrs.image, updateAttributes]
  )

  const url =
    getBlobUrl(editorDataSource.rootId, node.attrs?.image ?? {}, editorDataSource.blobs) ??
    linkStorage.get(node.attrs.uuid)

  if (url) {
    return (
      <PreviewMode
        node={node}
        deleteNode={deleteNode}
        getPos={getPos}
        updateImageAttributes={updateImageAttributes}
        url={url}
      />
    )
  }

  return (
    <UploaderMode node={node} deleteNode={deleteNode} getPos={getPos} updateImageAttributes={updateImageAttributes} />
  )
}
