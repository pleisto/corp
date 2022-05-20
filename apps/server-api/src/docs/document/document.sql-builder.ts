import { DatabasePool, sql, values, assignment, withResultType } from '@brickdoc/nestjs-slonik'
import { Result, ok } from '@brickdoc/active-support'
import { Document } from './document.object-type'

/**
 * Find user by `id`
 */
export const findDocumentById = async (dbPool: DatabasePool, docId: string): Promise<Result<null | Document, Error>> => {
  return await withResultType(dbPool).one(sql<Document>`
SELECT
    id,
    state,
    state_id "stateId"
FROM
    blocks
WHERE
    id = ${docId} AND type = 'document'::block_type
LIMIT 1
`)
}


/**
 * Upsert a Document
 */

export const upsertDocument = async (
  dbPool: DatabasePool,
  docId: string,
  document: {
    state: string,
    stateId: string
  }
): Promise<Result<null, Error>> => {
  const timestampz = new Date().toISOString()
  const { state, stateId } = document

  const updatedValues = {
    state, state_id: stateId,
    updated_at: timestampz
  }

  const insertValues = {
    id: docId,
    type: 'document',
    created_at: timestampz,
    ...updatedValues,
  }

  const result = await withResultType(dbPool).any(sql`
INSERT Into blocks (id, type, created_at, state, state_id, updated_at)
    VALUES (${values.fromObject(insertValues)})
ON CONFLICT (id)
    DO UPDATE SET
        ${assignment.fromObject(updatedValues)}
`)

  return result.andThen(() => ok(null))
}