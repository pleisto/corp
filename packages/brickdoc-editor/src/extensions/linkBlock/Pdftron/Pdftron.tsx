import React from 'react'
import WebViewer from '@pdftron/webviewer'
import './Pdftron.less'

export interface PdftronProps {
  docLink: string
  fileName: string
}

export const Pdftron: React.FC<PdftronProps> = ({ docLink, fileName }) => {
  const viewer = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    void WebViewer(
      {
        path: '/pdftron',
        css: '/pdftron.css',
        disabledElements: ['toolsHeader', 'header', 'textPopup', 'contextMenuPopup'],
        initialDoc: docLink
      },
      viewer.current as HTMLDivElement
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div ref={viewer} className="brickdoc-pdftron-container" />
      <div className="brickdoc-pdftron-info">{fileName}</div>
    </div>
  )
}
