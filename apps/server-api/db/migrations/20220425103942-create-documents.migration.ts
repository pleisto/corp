import { Migration } from '@slonik/migrator'

export const up: Migration = async ({ context: { connection, sql } }) => {
  await connection.query(sql`
  CREATE TABLE "documents" (
    "id" uuid PRIMARY KEY,
    "path" LTREE NOT NULL,
    "space_id" uuid NOT NULL,
    "type" SMALLINT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "slug" TEXT,
    "slug_path" LTREE NOT NULL,
    "state" bytea,
    "state_id" uuid,
    "sort" BIGINT,
    "meta" JSONB,
    "deleted_at" TIMESTAMP NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL
  );
  CREATE UNIQUE INDEX "documents_slug_ukey"
   ON "documents" ("slug", "slug_path", "space_id") WHERE "slug" IS NOT NULL;;
  `)
}

export const down: Migration = async ({ context: { connection, sql } }) => {
  await connection.query(sql`
  DROP TABLE "documents";
  `)
}
