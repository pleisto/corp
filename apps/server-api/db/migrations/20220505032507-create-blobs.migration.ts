import { Migration } from '@slonik/migrator'

export const up: Migration = async ({ context: { connection, sql } }) => {
  await connection.query(sql`
  CREATE TABLE "blobs" (
    "id" BIGSERIAL PRIMARY KEY,
    "cid" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL DEFAULT 'application/octet-stream',
    "metadata" JSONB NOT NULL DEFAULT '{"analyzed": false}'::jsonb,
    "byte_size" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE UNIQUE INDEX "blobs_cid_ukey" ON "blobs" ("cid");
  CREATE INDEX "blobs_metadata" ON "blobs" USING GIN("metadata");
  COMMENT ON TABLE "blobs" IS 'blobs is a table for uploaded files metadata';
  COMMENT ON COLUMN "blobs"."cid" IS
    'cid is the unique content id of the file. It is compatible with IPFS CIDv1 spec';
  `)
}

export const down: Migration = async ({ context: { connection, sql } }) => {
  await connection.query(sql`DROP TABLE IF EXISTS "blobs";`)
}
