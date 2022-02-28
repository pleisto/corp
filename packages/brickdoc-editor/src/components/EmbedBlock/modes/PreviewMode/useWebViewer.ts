import React from 'react'
import PDFWebViewer from '@pdftron/pdfjs-express-viewer'
import WebViewer, { WebViewerInstance } from '@pdftron/webviewer'
import { FileType } from '../../../../helpers'

export function useWebViewer(
  fileType: FileType,
  initialDoc: string,
  dom: React.RefObject<HTMLDivElement>,
  onInstance: (instance: WebViewerInstance) => void
) {
  const WebViewerCreator = fileType === 'pdf' ? PDFWebViewer : WebViewer
  const path = fileType === 'pdf' ? '/pdfjs' : '/pdftron'
  React.useEffect(() => {
    void WebViewerCreator(
      {
        licenseKey: 'b6kvL5YZiMM4wdhtAN7i',
        path,
        css: '/pdftron.css',
        disabledElements: ['toolsHeader', 'header', 'textPopup', 'contextMenuPopup'],
        initialDoc
      },
      dom.current!
    ).then(onInstance)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
