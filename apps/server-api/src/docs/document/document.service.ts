import { Injectable } from '@nestjs/common'
import { InjectPool, type DatabasePool } from '@brickdoc/nestjs-slonik'
import { Document } from './document.object-type'
import { SyncDocumentInput } from './syncDocumentInput.input-type'
import { SyncDocumentResult } from './syncDocumentResult.object-type'

import { findDocumentById, upsertDocument } from './document.sql-builder'
import { Result } from '@brickdoc/active-support'
@Injectable()
export class DocumentService {
  constructor(@InjectPool() private readonly pool: DatabasePool) {}

  /**
   * Get a document by uuid
   * @param id
   */
  async getById(id: string): Promise<Result<null | Document, Error>> {
    return await findDocumentById(this.pool, id)
  }

  async syncDocument(input: SyncDocumentInput): Promise<SyncDocumentResult> {
    const documentResult = await findDocumentById(this.pool, input.id)
    const document: Document = documentResult.unwrapOr(null) ?? {id: input.id, stateId: null, state: null}

    if (!document.stateId || (document.stateId === input.previousStateId)) {
      const upsertResult = await upsertDocument(this.pool, input.id, {
        state: input.state,
        stateId: input.stateId
      })
      if (upsertResult.isErr()) throw upsertResult.error
      return {
        document: {
          id: document.id,
          stateId: input.stateId,
          state: null
        }
      }
    } else {
      return { document }
    }
  }
}
