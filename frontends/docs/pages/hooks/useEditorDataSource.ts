import React from 'react'
import { DataSource } from '@brickdoc/editor'
import { GetChildrenBlocksQuery } from '@/BrickdocGraphQL'

export interface UseEditorDataSourceProps {
  blocks: GetChildrenBlocksQuery['childrenBlocks']
}

export function useEditorDataSource({ blocks }: UseEditorDataSourceProps): DataSource {
  const dataSource = React.useRef<DataSource>(new DataSource())

  // blobs
  React.useEffect(() => {
    dataSource.current.blobs =
      blocks?.reduce<DataSource['blobs']>((prev, cur) => {
        return {
          ...prev,
          [cur.id]:
            cur.blobs?.map(blob => ({
              key: blob.blobKey,
              url: blob.url
            })) ?? []
        }
      }, {}) ?? {}
  }, [blocks])

  return dataSource.current
}
