import { Migration } from '@slonik/migrator'

export const up: Migration = async ({ context: { connection, sql } }) => {
  await connection.query(sql`
  CREATE TYPE pod_kind AS ENUM ('user', 'space');

  CREATE TABLE "pods" (
    "id" SERIAL PRIMARY KEY,
    "kind" pod_kind NOT NULL,
    "locked_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT
  );
  CREATE UNIQUE INDEX "pods_lower_slug_text_ukey" ON "pods" USING btree (lower(("slug")::text));

  CREATE TABLE "users"(
    "initialized" BOOLEAN NOT NULL DEFAULT FALSE
  ) inherits("pods");

  CREATE TABLE "spaces" (
    "owner_id" BIGINT NOT NULL,
    "invite_enable" BOOLEAN NOT NULL DEFAULT FALSE,
    "invite_secret" TEXT NOT NULL,
    CONSTRAINT spaces_owner_id_fk FOREIGN KEY(owner_id) REFERENCES pods(id) ON DELETE RESTRICT
  ) inherits("pods");
  -- CREATE INDEX "spaces_owner_id_key" ON "spaces" USING btree ("owner_id");
  CREATE UNIQUE INDEX "spaces_invite_secret_ukey" ON "spaces" ("invite_secret");

  CREATE TABLE "users_providers" (
    "id" SERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "provider" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,
    CONSTRAINT users_providers_user_id_fk FOREIGN KEY(user_id) REFERENCES pods(id) ON DELETE CASCADE
  );
  CREATE UNIQUE INDEX "users_providers_provider_subject_ukey" ON "users_providers" ("provider", "subject");
  COMMENT ON COLUMN "users_providers"."meta" IS 'Provider metadata';

  CREATE TABLE "spaces_members" (
    "id" SERIAL PRIMARY KEY,
    "space_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "role" INTEGER NOT NULL,
    "state" INTEGER DEFAULT 0 NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,
    CONSTRAINT spaces_members_space_id_fk FOREIGN KEY(space_id) REFERENCES pods(id) ON DELETE CASCADE,
    CONSTRAINT spaces_members_user_id_fk FOREIGN KEY(user_id) REFERENCES pods(id) ON DELETE CASCADE
  );

  CREATE TABLE "events" (
    "id" SERIAL PRIMARY KEY,
    "actor_type" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "target_type" TEXT,
    "target_id" TEXT,
    "event" TEXT NOT NULL,
    "context" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "created_at" TIMESTAMP NOT NULL
  ) with(fillfactor=85);

  CREATE INDEX "events_actor_type_actor_id_event_key" ON "events" ("actor_type", "actor_id", "event");
  `)
}

export const down: Migration = async ({ context: { connection, sql } }) => {
  await connection.query(sql`
  DROP TABLE IF EXISTS "users";
  DROP TABLE IF EXISTS "users_providers";
  DROP TABLE IF EXISTS "spaces_members";
  DROP TABLE IF EXISTS "spaces";
  DROP TABLE IF EXISTS "events";
  DROP TABLE IF EXISTS "pods";
  DROP TYPE IF EXISTS "pod_kind"
  `)
}
