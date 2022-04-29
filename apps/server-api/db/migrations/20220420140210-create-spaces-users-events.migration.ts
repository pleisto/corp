import { Migration } from '@slonik/migrator'

export const up: Migration = async ({ context: { connection, sql } }) => {
  await connection.query(sql`
  CREATE TABLE "accounts_users" (
    "id" SERIAL PRIMARY KEY,
    "locked_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL
  );

  CREATE TABLE "accounts_providers" (
    "id" SERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "provider" CHARACTER VARYING(50) NOT NULL,
    "subject" CHARACTER VARYING(50) NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,
    CONSTRAINT accounts_providers_user_id_fk FOREIGN KEY(user_id) REFERENCES accounts_users(id) ON DELETE CASCADE
  );
  CREATE UNIQUE INDEX "accounts_providers_provider_subject_ukey" ON "accounts_providers" ("provider", "subject");
  COMMENT ON COLUMN "accounts_providers"."meta" IS 'Provider metadata';

  CREATE TABLE "spaces" (
    "id" SERIAL PRIMARY KEY,
    "owner_id" BIGINT NOT NULL,
    "locked_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,
    "domain" CHARACTER VARYING(50) NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "initialized" BOOLEAN NOT NULL DEFAULT FALSE,
    "personal" BOOLEAN NOT NULL DEFAULT FALSE,
    "invite_enable" BOOLEAN NOT NULL DEFAULT FALSE,
    "invite_secret" CHARACTER VARYING(50) NOT NULL,
    CONSTRAINT spaces_owner_id_fk FOREIGN KEY(owner_id) REFERENCES accounts_users(id) ON DELETE RESTRICT
  );
  CREATE UNIQUE INDEX "spaces_invite_secret_ukey" ON "spaces" ("invite_secret");
  CREATE UNIQUE INDEX "spaces_lower_domain_text_ukey" ON "spaces" USING btree (lower(("domain")::text));

  CREATE TABLE "spaces_members" (
    "id" SERIAL PRIMARY KEY,
    "space_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "role" INTEGER NOT NULL,
    "state" INTEGER DEFAULT 0 NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,
    CONSTRAINT spaces_members_space_id_fk FOREIGN KEY(space_id) REFERENCES spaces(id) ON DELETE CASCADE,
    CONSTRAINT spaces_members_user_id_fk FOREIGN KEY(user_id) REFERENCES accounts_users(id) ON DELETE CASCADE
  );

  CREATE TABLE "events" (
    "id" SERIAL PRIMARY KEY,
    "actor_type" CHARACTER VARYING(50) NOT NULL,
    "actor_id" CHARACTER VARYING(50) NOT NULL,
    "event" CHARACTER VARYING(255) NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "created_at" TIMESTAMP NOT NULL
  ) with(fillfactor=85);

  CREATE INDEX "events_actor_type_actor_id_event_key" ON "events" ("actor_type", "actor_id", "event");
  `)
}

export const down: Migration = async ({ context: { connection, sql } }) => {
  await connection.query(sql`
  DROP TABLE IF EXISTS "accounts_users";
  DROP TABLE IF EXISTS "accounts_providers";
  DROP TABLE IF EXISTS "spaces_members";
  DROP TABLE IF EXISTS "spaces";
  DROP TABLE IF EXISTS "events";
  `)
}
