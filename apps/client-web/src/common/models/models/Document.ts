import { Model } from '../types'
import { Block, BlockMeta } from '@brickdoc/schema'
import { Y } from '@brickdoc/editor'

export interface DocumentMeta extends BlockMeta {}

export interface Document extends Model {
  id: string
  blocks?: Block[] // NOTE: old blocks API
  ydoc?: Y.Doc
  meta?: DocumentMeta
}
