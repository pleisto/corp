import { Model } from '../types'
import { Block } from '@brickdoc/schema'
import { Y } from '@brickdoc/editor'

export interface Document extends Model {
  blocks?: Block[] // NOTE: old blocks API
  ydoc?: Y.Doc
}
