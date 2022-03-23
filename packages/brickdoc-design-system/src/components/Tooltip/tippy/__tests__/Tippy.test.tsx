import { render } from '@testing-library/react'
import { forwardRef, useRef } from 'react'
import { Tippy } from '../Tippy'
describe('Tippy React wrapper', () => {
  it('with an element as children', () => {
    render(
      <Tippy>
        <button>Hello world!</button>
      </Tippy>
    )
  })
  it('with a string as children', () => {
    render(<Tippy>abc</Tippy>)
  })
  it('with a number as children', () => {
    render(<Tippy>42</Tippy>)
  })
  it('with a fragment as children', () => {
    render(
      <Tippy>
        <h1>Hello world</h1>
        <p>Lorem ipsum</p>
      </Tippy>
    )
  })
  it('with nothing as children', () => {
    render(<Tippy />)
  })

  it('has ref', () => {
    render(
      <Tippy>
        <X />
      </Tippy>
    )
  })
})

const X = forwardRef(() => {
  const ref = useRef<HTMLButtonElement>(null)
  return <button ref={ref}>Ref++</button>
})
