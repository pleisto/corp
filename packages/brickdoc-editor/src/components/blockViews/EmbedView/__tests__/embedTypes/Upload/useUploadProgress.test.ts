import { renderHook } from '@testing-library/react-hooks'
import { useRef } from 'react'
import { EmbedAttributes, EmbedOptions } from '../../../../../../extensions'
import { mockBlockViewProps } from '../../../../../../test'
import { useUploadProgress } from '../../../embedTypes/Upload/useUploadPorgress'

jest.mock('@brickdoc/uploader', () => ({
  imperativeUpload: (file: File, config: any) => {
    config.onProgress({})
    config.onUploaded({})
  }
}))

describe('useUploadProgress', () => {
  it('uploads file correctly', () => {
    const { node } = mockBlockViewProps<EmbedOptions, EmbedAttributes>()
    const updateEmbedBlockAttributes = jest.fn()
    const { result } = renderHook(() => {
      const ref = useRef<HTMLInputElement>(document.createElement('input'))
      return useUploadProgress(node, updateEmbedBlockAttributes, ref)
    })

    const { onFileInputChange } = result.current

    const event = {
      target: {
        files: [new File([], 'name')]
      }
    }
    onFileInputChange(event as any)

    expect(updateEmbedBlockAttributes).toBeCalled()
  })

  it('chooses file correctly', () => {
    const { node } = mockBlockViewProps<EmbedOptions, EmbedAttributes>()
    const updateEmbedBlockAttributes = jest.fn()
    const inputRef = {
      current: {
        click: jest.fn()
      }
    }
    const { result } = renderHook(() => {
      return useUploadProgress(node, updateEmbedBlockAttributes, inputRef as any)
    })

    const { onChooseFile } = result.current

    onChooseFile()

    expect(inputRef.current.click).toBeCalled()
  })
})
