import { BUILTIN_CLAUSES } from '..'
import { FormulaContext } from '../../context'
import { NormalFunctionClause } from '../..'

const ctx = new FormulaContext()

describe('clause examples', () => {
  ;(BUILTIN_CLAUSES as NormalFunctionClause[]).forEach(({ name, examples, reference }) => {
    it(`${name} examples`, () => {
      // eslint-disable-next-line max-nested-callbacks
      examples.forEach(({ input, output }) => {
        expect(reference(ctx, ...input)).toEqual(output)
      })
    })
  })
})
