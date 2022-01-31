import merge from 'lodash/merge'
import { Palettes } from './palettes'
import { Atomics } from './atomics'
import { Semantics } from './semantics'
import { Ceramics } from './ceramics'

export const colors = {
  ...Palettes,
  ...merge(Palettes, Atomics),
  ...Ceramics
}

export const semanticTokens = {
  colors: Semantics
}
