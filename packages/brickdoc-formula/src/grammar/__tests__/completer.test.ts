import { complete, FormulaLexer } from '..'
import { FormulaContext } from '../../context'

const formulaContext = new FormulaContext({ functionClauses: [] })

describe('Complete', () => {
  it('work', () => {
    const input = '=123'
    const lexResult = FormulaLexer.tokenize(input)
    const tokens = lexResult.tokens

    const result = complete({ formulaContext, tokens })
    expect(result.length).not.toBe(0)
  })
})
