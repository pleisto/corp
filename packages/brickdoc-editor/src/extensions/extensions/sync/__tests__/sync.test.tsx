import { renderHook } from '@testing-library/react-hooks'
import { useTestEditor } from '../../../../test/testEditor'
import { Sync } from '../sync'

describe('sync', () => {
  it('triggers replaceRoot correctly', () => {
    const { result } = renderHook(() =>
      useTestEditor({
        extensions: [
          Sync.configure({
            types: [
              'blockquote',
              'bulletList',
              'codeBlock',
              'embedBlock',
              'formulaBlock',
              'hardBreak',
              'heading',
              'horizontalRule',
              'imageBlock',
              'listItem',
              'orderedList',
              'paragraph',
              'subPageMenuBlock',
              'tocBlock',
              'spreadsheetBlock'
            ]
          })
        ]
      })
    )

    const editor = result.current

    expect(() => {
      editor?.commands.replaceRoot({
        content: []
      })
    }).not.toThrow()
  })

  it('triggers onSave correctly', () => {
    const mockSave = jest.fn()
    const { result } = renderHook(() =>
      useTestEditor({
        extensions: [
          Sync.configure({
            onSave: mockSave,
            types: [
              'blockquote',
              'bulletList',
              'codeBlock',
              'embedBlock',
              'formulaBlock',
              'hardBreak',
              'heading',
              'horizontalRule',
              'imageBlock',
              'listItem',
              'orderedList',
              'paragraph',
              'subPageMenuBlock',
              'tocBlock',
              'spreadsheetBlock'
            ]
          })
        ]
      })
    )

    const editor = result.current

    editor?.commands.setContent(
      {
        content: []
      },
      true
    )

    expect(mockSave).toBeCalled()
  })

  it('triggers setDocAttrs correctly', () => {
    const mockSave = jest.fn()
    const { result } = renderHook(() =>
      useTestEditor({
        extensions: [
          Sync.configure({
            onSave: mockSave,
            types: [
              'blockquote',
              'bulletList',
              'codeBlock',
              'embedBlock',
              'formulaBlock',
              'hardBreak',
              'heading',
              'horizontalRule',
              'imageBlock',
              'listItem',
              'orderedList',
              'paragraph',
              'subPageMenuBlock',
              'tocBlock',
              'spreadsheetBlock'
            ]
          })
        ]
      })
    )

    const editor = result.current
    const newUuid = 'new uuid'

    editor?.commands.setDocAttrs({
      uuid: newUuid
    })

    expect(mockSave).toBeCalled()
    expect(editor?.state.doc.attrs.uuid).toEqual(newUuid)
  })
})
