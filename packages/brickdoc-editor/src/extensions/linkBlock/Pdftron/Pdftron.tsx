import React from 'react'
import WebViewer from '@pdftron/webviewer'
import './Pdftron.less'

export interface PdftronProps {}

export const Pdftron: React.FC<PdftronProps> = () => {
  const viewer = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    void WebViewer(
      { path: '/pdftron', initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/sales_tracker.xlsx' },
      viewer.current as HTMLDivElement
    )
  }, [])

  return <div ref={viewer} className="brickdoc-pdftron-container" />
}
