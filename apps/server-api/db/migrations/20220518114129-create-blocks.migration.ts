import { Migration } from '@slonik/migrator'

export const up: Migration = async ({ context: { connection, sql } }) => {
  await connection.query(sql`
  CREATE TYPE "block_type" AS ENUM ('document', 'component');

  CREATE TABLE "blocks" (
    "id" uuid PRIMARY KEY,
    "type" block_type NOT NULL,
    "state" TEXT,
    "state_id" uuid,
    "sort" BIGINT,
    "meta" JSONB,
    "deleted_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL
  );`)
}

export const down: Migration = async ({ context: { connection, sql } }) => {
  await connection.query(sql`
  DROP TABLE IF EXISTS "blocks";
  DROP TYPE IF EXISTS "block_type";
  `)
}
