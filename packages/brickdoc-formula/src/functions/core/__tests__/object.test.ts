import { FormulaContext } from '../../../context'
import { T, TYPE } from '../object'

const ctx = new FormulaContext()

describe('object', () => {
  it('T', () => {
    expect(T(ctx, false)).toBe(false)
    expect(T(ctx, [])).toStrictEqual([])
  })

  it('TYPE', () => {
    expect(TYPE(ctx, 1)).toBe('number')
    expect(TYPE(ctx, [])).toBe('object')
  })
})
