import { render } from '@testing-library/react'
import { BlockContainer } from '../'
import { EditorPropsContext } from '../../../../context'
import * as editorPropsHooks from '../../../../hooks/useEditorPropsContext'

describe('BlockContainer', () => {
  it(`changes block pointer event when editor editable state change`, () => {
    const editorProps = { ...EditorPropsContext }
    const node: any = { attrs: { uuid: 1 } }
    jest.spyOn(editorPropsHooks, 'useEditorPropsContext').mockImplementation(() => editorProps)

    const { container, rerender } = render(<BlockContainer node={node} />)
    // expect dom has 'pointer-event: none' style
    expect(container).toMatchSnapshot()

    editorProps.documentEditable = true

    rerender(<BlockContainer node={node} />)

    // expect dom has 'pointer-event: unset' style
    expect(container).toMatchSnapshot()
  })

  it('inline', () => {
    const node: any = { attrs: { uuid: 1 } }
    const { container } = render(
      <BlockContainer node={node} inline={true}>
        block
      </BlockContainer>
    )

    // expect dom has two pseudo span element at before and after
    expect(container).toMatchSnapshot()
  })

  // TODO: move to e2e test
  it('with actionOptions', () => {
    const node: any = { attrs: { uuid: 1 } }
    const { container } = render(
      <BlockContainer
        node={node}
        actionOptions={[
          {
            type: 'item',
            name: 'item'
          }
        ]}
      >
        block
      </BlockContainer>
    )

    expect(container).toMatchSnapshot()
  })

  it('with editable = false', () => {
    const node: any = { attrs: { uuid: 1 } }
    const { container } = render(
      <BlockContainer node={node} editable={false}>
        block
      </BlockContainer>
    )

    expect(container.firstChild).toHaveStyle({
      'pointer-events': 'none'
    })
  })

  // TODO: move to e2e test
  it('hide action options when node without uuid', () => {
    const node: any = { attrs: {} }
    const { container } = render(
      <BlockContainer node={node} editable={false}>
        block
      </BlockContainer>
    )

    expect(container).toMatchSnapshot()
  })
})
