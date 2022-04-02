import { render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { EditorContentType, FormulaEditorContent, useFormulaEditor } from '../formulaEditor'

describe('formulaEditor', () => {
  it('renders formula editor correctly', () => {
    const editorContent: Partial<EditorContentType> = {
      content: { type: 'doc', content: [{ type: 'paragraph', content: [] }] }
    }

    const { result } = renderHook(() =>
      useFormulaEditor({ editable: true, editorContent: editorContent as EditorContentType })
    )
    const editor = result.current

    const { container } = render(
      <FormulaEditorContent rootId="rootId" formulaId="formulaId" editable={true} editor={editor} />
    )

    expect(container).toMatchSnapshot()
  })

  it('triggers onBlur correctly', () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      const time = 1
      cb(time)
      return time
    })
    const editorContent: Partial<EditorContentType> = {
      content: { type: 'doc', content: [{ type: 'paragraph', content: [] }] }
    }
    const mockBlur = jest.fn()

    const { result } = renderHook(() =>
      useFormulaEditor({ editable: true, editorContent: editorContent as EditorContentType, onBlur: mockBlur })
    )
    const editor = result.current

    render(<FormulaEditorContent rootId="rootId" formulaId="formulaId" editable={true} editor={editor} />)

    editor?.commands.focus()
    editor?.commands.blur()

    expect(mockBlur).toBeCalled()
  })

  it('updates content correctly', () => {
    const editorContent: Partial<EditorContentType> = {
      content: { type: 'doc', content: [{ type: 'paragraph', content: [] }] }
    }
    const mockUpdate = jest.fn()

    const { result } = renderHook(() =>
      useFormulaEditor({
        editable: true,
        rootId: 'rootId',
        formulaId: 'formulaId',
        editorContent: editorContent as EditorContentType,
        updateEditor: mockUpdate
      })
    )
    const editor = result.current

    render(<FormulaEditorContent rootId="rootId" formulaId="formulaId" editable={true} editor={editor} />)

    editor?.commands.setContent([{ type: 'paragraph', content: [{ type: 'text', text: 'text' }] }], true)

    expect(mockUpdate).toBeCalled()
  })
})
