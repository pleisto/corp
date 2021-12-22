import { FC, forwardRef, memo, createRef } from 'react'
import { render } from '@testing-library/react'
import { supportRef, composeRef } from '../ref'

describe('composeRef', () => {
  it('basic', () => {
    const refFunc1 = jest.fn()
    const refFunc2 = jest.fn()

    const mergedRef = composeRef(refFunc1, refFunc2) as Function
    const testRefObj = {}
    mergedRef(testRefObj)
    expect(refFunc1).toHaveBeenCalledWith(testRefObj)
    expect(refFunc2).toHaveBeenCalledWith(testRefObj)
  })

  it('ignore empty', () => {
    const ref = createRef()
    expect(composeRef(ref, null, undefined)).toBe(ref)
    expect(composeRef(null, undefined)).toBeFalsy()
  })
})

describe('supportRef', () => {
  it('function component', () => {
    const TestFC: FC = () => {
      return <div />
    }
    const wrapper = render(
      <div>
        <TestFC />
      </div>
    )
    expect(supportRef(TestFC)).toBeFalsy()
    expect(supportRef(wrapper.container.firstChild)).toBeFalsy()
  })

  it('forwardRef function component', () => {
    const ForwardRC = forwardRef(() => <div />)
    const wrapper = render(
      <div>
        <ForwardRC />
      </div>
    )
    expect(supportRef(ForwardRC)).toBeTruthy()
    expect(supportRef(wrapper.container.firstChild)).toBeTruthy()
  })

  it('memo of function component', () => {
    const TestFC: FC = () => {
      return <div />
    }
    const MemoFC = memo(TestFC)
    const wrapper = render(
      <div>
        <MemoFC />
      </div>
    )
    expect(supportRef(MemoFC)).toBeFalsy()
    expect(supportRef(wrapper.container.firstChild)).toBeFalsy()
  })

  it('memo of forwardRef function component', () => {
    const ForwardRC = forwardRef(() => <div />)
    const MemoForwardRC = memo(ForwardRC)
    const wrapper = render(
      <div>
        <MemoForwardRC />
      </div>
    )
    expect(supportRef(MemoForwardRC)).toBeTruthy()
    expect(supportRef(wrapper.container.firstChild)).toBeTruthy()
  })
})
