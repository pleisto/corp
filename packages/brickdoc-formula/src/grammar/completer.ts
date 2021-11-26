import type { IToken } from 'chevrotain'
import type { Completion, ContextInterface } from '..'

export interface CompleteInput {
  readonly tokens: IToken[]
  readonly formulaContext: ContextInterface
}

// TODO: https://github.com/Chevrotain/chevrotain/blob/master/examples/parser/content_assist/content_assist_complex.js
export const complete = ({ tokens, formulaContext }: CompleteInput): Completion[] => {
  return formulaContext.completions()
}
