import { render } from '@testing-library/react'
import { BlockContainer } from '../'

describe('BlockContainer', () => {
  it(`freezes block when editor isn't editable`, () => {
    const { container } = render(<BlockContainer />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
