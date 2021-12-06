import React from 'react'
import { fabric } from 'fabric'
import { NodeViewProps } from '@tiptap/core'
import { BlockWrapper } from '../../BlockWrapper'

export interface CanvasBlockProps extends NodeViewProps {}

export const CanvasBlock: React.FC<CanvasBlockProps> = ({ editor, node, updateAttributes, extension, getPos }) => {
  React.useEffect(() => {
    const canvas = new fabric.Canvas('my-fabric-canvas')
    const rect = new fabric.Rect({
      width: 50,
      height: 50,
      fill: 'blue',
      angle: 10,
      top: 20,
      left: 20
    })
    const textbox = new fabric.Textbox('Click on the Rectangle to move it.', {
      fontSize: 20,
      left: 50,
      top: 100,
      width: 200
    })
    canvas.add(textbox)
    canvas.add(rect)

    // UseEffect's cleanup function
    return () => {
      canvas.dispose()
    }
  }, [])

  return (
    <BlockWrapper as="span" editor={editor}>
      <div className="App">
        <canvas id="my-fabric-canvas" width="400" height="300" />
      </div>
    </BlockWrapper>
  )
}
