import React from 'react'
import { fabric } from 'fabric'
import { NodeViewProps } from '@tiptap/core'
import { BlockWrapper } from '../../../components'
import { EditorDataSourceContext } from '../../..'

export interface CanvasBlockProps extends NodeViewProps {}

const canvasId = 'canvas'

export const CanvasBlock: React.FC<CanvasBlockProps> = ({ editor, node, updateAttributes, extension, getPos }) => {
  const [input, setInput] = React.useState<string>('Move me')
  const editorDataSource = React.useContext(EditorDataSourceContext)
  const formulaContext = editorDataSource.formulaContext

  console.log(formulaContext?.variableCount())

  React.useEffect(() => {
    const canvas = new fabric.Canvas(canvasId)
    const textbox = new fabric.Textbox(input, {
      fontSize: 20,
      left: 50,
      top: 100,
      width: 200
    })
    canvas.add(textbox)

    canvas.on('object:moving', e => {
      console.log(e.target)
    })
    canvas.on('object:modified', e => {
      const text = (e.target as any).text
      console.log(text)
      setInput(text)
    })

    // UseEffect's cleanup function
    return () => {
      canvas.dispose()
    }
  }, [input, setInput])

  return (
    <BlockWrapper as="span" editor={editor}>
      <div className="App">
        <canvas id={canvasId} width="400" height="300" />
      </div>
    </BlockWrapper>
  )
}
