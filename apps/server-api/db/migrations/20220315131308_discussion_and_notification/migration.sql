-- CreateEnum
CREATE TYPE "discussion_conversation_state" AS ENUM ('OPENDED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "notification_state" AS ENUM ('UNREAD', 'READ');

-- CreateTable
CREATE TABLE "accounts_federated_identities" (
    "id" BIGSERIAL NOT NULL,
    "accounts_user_id" BIGINT,
    "provider" VARCHAR NOT NULL,
    "uid" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "accounts_federated_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts_members" (
    "id" BIGSERIAL NOT NULL,
    "space_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "role" INTEGER NOT NULL,
    "state" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "accounts_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts_users" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR,
    "encrypted_password" VARCHAR NOT NULL DEFAULT E'',
    "reset_password_token" VARCHAR,
    "reset_password_sent_at" TIMESTAMP(6),
    "remember_created_at" TIMESTAMP(6),
    "sign_in_count" INTEGER NOT NULL DEFAULT 0,
    "current_sign_in_at" TIMESTAMP(6),
    "last_sign_in_at" TIMESTAMP(6),
    "current_sign_in_ip" VARCHAR,
    "last_sign_in_ip" VARCHAR,
    "confirmation_token" VARCHAR,
    "confirmed_at" TIMESTAMP(6),
    "confirmation_sent_at" TIMESTAMP(6),
    "unconfirmed_email" VARCHAR,
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "unlock_token" VARCHAR,
    "locked_at" TIMESTAMP(6),
    "locale" VARCHAR(17),
    "timezone" VARCHAR,
    "deleted_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "last_space_domain" VARCHAR,
    "last_block_ids" JSON NOT NULL DEFAULT '{}',

    CONSTRAINT "accounts_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "active_storage_attachments" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "record_id" VARCHAR NOT NULL,
    "record_type" VARCHAR NOT NULL,
    "blob_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "active_storage_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "active_storage_blobs" (
    "id" BIGSERIAL NOT NULL,
    "key" VARCHAR NOT NULL,
    "filename" VARCHAR NOT NULL,
    "content_type" VARCHAR,
    "metadata" TEXT,
    "service_name" VARCHAR NOT NULL,
    "byte_size" BIGINT NOT NULL,
    "checksum" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "space_id" BIGINT,
    "user_id" BIGINT,
    "block_id" UUID,
    "operation_type" VARCHAR NOT NULL DEFAULT E'THIRD',

    CONSTRAINT "active_storage_blobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "active_storage_variant_records" (
    "id" BIGSERIAL NOT NULL,
    "blob_id" BIGINT NOT NULL,
    "variation_digest" VARCHAR NOT NULL,

    CONSTRAINT "active_storage_variant_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ar_internal_metadata" (
    "key" VARCHAR NOT NULL,
    "value" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "ar_internal_metadata_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "brickdoc_configs" (
    "id" BIGSERIAL NOT NULL,
    "key" VARCHAR NOT NULL,
    "value" TEXT,
    "scope" VARCHAR NOT NULL,
    "domain" VARCHAR NOT NULL,
    "domain_len" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "brickdoc_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_conversations" (
    "id" BIGSERIAL NOT NULL,
    "mark_ids" TEXT[],
    "block_ids" TEXT[],
    "page_id" TEXT NOT NULL,
    "space_id" BIGINT NOT NULL,
    "interlocutor_ids" BIGINT[],
    "creator_id" BIGINT NOT NULL,
    "state" "discussion_conversation_state" NOT NULL DEFAULT E'OPENDED',
    "latest_reply_at" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discussion_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_comments" (
    "id" BIGSERIAL NOT NULL,
    "content" JSONB NOT NULL,
    "creator_id" BIGINT NOT NULL,
    "conversation_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discussion_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docs_aliases" (
    "id" BIGSERIAL NOT NULL,
    "space_id" BIGINT NOT NULL,
    "alias" VARCHAR NOT NULL,
    "block_id" UUID NOT NULL,
    "payload" JSON NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "state" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "docs_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docs_blocks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "space_id" BIGINT NOT NULL,
    "type" VARCHAR(32),
    "parent_id" UUID,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "data" JSONB NOT NULL,
    "history_version" BIGINT NOT NULL DEFAULT 0,
    "snapshot_version" BIGINT NOT NULL DEFAULT 0,
    "sort" BIGINT NOT NULL DEFAULT 0,
    "collaborators" BIGINT[],
    "deleted_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "root_id" UUID NOT NULL,
    "content" JSONB DEFAULT '[]',
    "text" TEXT DEFAULT E'',
    "page" BOOLEAN NOT NULL DEFAULT false,
    "deleted_permanently_at" TIMESTAMP(6),

    CONSTRAINT "docs_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docs_formulas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "space_id" BIGINT NOT NULL,
    "block_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "definition" TEXT NOT NULL,
    "cache_value" JSON NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "type" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "docs_formulas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docs_histories" (
    "id" BIGSERIAL NOT NULL,
    "space_id" BIGINT,
    "meta" JSONB NOT NULL,
    "data" JSONB NOT NULL,
    "block_id" UUID NOT NULL,
    "parent_id" UUID,
    "type" VARCHAR(32),
    "sort" BIGINT NOT NULL,
    "history_version" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "content" JSONB DEFAULT '[]',
    "text" TEXT DEFAULT E'',
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "docs_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docs_pins" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "space_id" BIGINT NOT NULL,
    "block_id" UUID NOT NULL,
    "deleted_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "docs_pins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docs_share_links" (
    "id" BIGSERIAL NOT NULL,
    "block_id" UUID NOT NULL,
    "space_id" BIGINT NOT NULL,
    "key" VARCHAR NOT NULL,
    "state" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "policy" INTEGER NOT NULL,
    "share_space_id" BIGINT,

    CONSTRAINT "docs_share_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docs_snapshots" (
    "id" BIGSERIAL NOT NULL,
    "space_id" BIGINT,
    "block_id" UUID NOT NULL,
    "snapshot_version" BIGINT NOT NULL,
    "version_meta" JSONB,
    "name" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "docs_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flipper_features" (
    "id" BIGSERIAL NOT NULL,
    "key" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "flipper_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flipper_gates" (
    "id" BIGSERIAL NOT NULL,
    "feature_key" VARCHAR NOT NULL,
    "key" VARCHAR NOT NULL,
    "value" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "flipper_gates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "notification_type" VARCHAR NOT NULL,
    "state" "notification_state" NOT NULL DEFAULT E'UNREAD',
    "data" JSONB,
    "source_id" TEXT NOT NULL,
    "source_type" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schema_migrations" (
    "version" VARCHAR NOT NULL,

    CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version")
);

-- CreateTable
CREATE TABLE "stafftools_role_assignments" (
    "id" BIGSERIAL NOT NULL,
    "accounts_user_id" BIGINT NOT NULL,
    "stafftools_role_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "stafftools_role_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stafftools_roles" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "permissions" VARCHAR[],
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "stafftools_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spaces" (
    "id" BIGSERIAL NOT NULL,
    "owner_id" BIGINT NOT NULL,
    "domain" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "bio" VARCHAR(140),
    "personal" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "invite_enable" BOOLEAN NOT NULL DEFAULT false,
    "invite_secret" VARCHAR,

    CONSTRAINT "spaces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "index_accounts_federated_identities_on_accounts_user_id" ON "accounts_federated_identities"("accounts_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_accounts_federated_identities_on_provider_and_uid" ON "accounts_federated_identities"("provider", "uid");

-- CreateIndex
CREATE INDEX "index_accounts_members_on_space_id" ON "accounts_members"("space_id");

-- CreateIndex
CREATE INDEX "index_accounts_members_on_user_id" ON "accounts_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_accounts_users_on_email" ON "accounts_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "index_accounts_users_on_reset_password_token" ON "accounts_users"("reset_password_token");

-- CreateIndex
CREATE UNIQUE INDEX "index_accounts_users_on_confirmation_token" ON "accounts_users"("confirmation_token");

-- CreateIndex
CREATE UNIQUE INDEX "index_accounts_users_on_unlock_token" ON "accounts_users"("unlock_token");

-- CreateIndex
CREATE INDEX "index_accounts_users_on_deleted_at" ON "accounts_users"("deleted_at");

-- CreateIndex
CREATE INDEX "index_active_storage_attachments_on_blob_id" ON "active_storage_attachments"("blob_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_active_storage_attachments_uniqueness" ON "active_storage_attachments"("record_type", "record_id", "name", "blob_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_active_storage_blobs_on_key" ON "active_storage_blobs"("key");

-- CreateIndex
CREATE UNIQUE INDEX "index_active_storage_variant_records_uniqueness" ON "active_storage_variant_records"("blob_id", "variation_digest");

-- CreateIndex
CREATE UNIQUE INDEX "index_brickdoc_configs_on_key_and_scope_and_domain" ON "brickdoc_configs"("key", "scope", "domain");

-- CreateIndex
CREATE INDEX "discussion_conversations_page_id_space_id_idx" ON "discussion_conversations"("page_id", "space_id");

-- CreateIndex
CREATE INDEX "discussion_comments_conversation_id_idx" ON "discussion_comments"("conversation_id");

-- CreateIndex
CREATE INDEX "index_docs_aliases_on_block_id" ON "docs_aliases"("block_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_docs_aliases_on_space_id_and_alias" ON "docs_aliases"("space_id", "alias");

-- CreateIndex
CREATE INDEX "index_docs_blocks_on_collaborators" ON "docs_blocks"("collaborators");

-- CreateIndex
CREATE INDEX "index_docs_blocks_on_parent_id" ON "docs_blocks"("parent_id");

-- CreateIndex
CREATE INDEX "index_docs_blocks_on_space_id" ON "docs_blocks"("space_id");

-- CreateIndex
CREATE INDEX "index_docs_formulas_on_space_id" ON "docs_formulas"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_docs_formulas_on_block_id_and_name" ON "docs_formulas"("block_id", "name");

-- CreateIndex
CREATE INDEX "index_docs_histories_on_space_id" ON "docs_histories"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_docs_histories_on_block_id_and_history_version" ON "docs_histories"("block_id", "history_version");

-- CreateIndex
CREATE UNIQUE INDEX "index_docs_pins_on_user_id_and_space_id_and_block_id" ON "docs_pins"("user_id", "space_id", "block_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_docs_share_links_on_key" ON "docs_share_links"("key");

-- CreateIndex
CREATE INDEX "index_docs_share_links_on_share_space_id" ON "docs_share_links"("share_space_id");

-- CreateIndex
CREATE INDEX "index_docs_snapshots_on_space_id" ON "docs_snapshots"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_docs_snapshots_on_block_id_and_snapshot_version" ON "docs_snapshots"("block_id", "snapshot_version");

-- CreateIndex
CREATE UNIQUE INDEX "index_flipper_features_on_key" ON "flipper_features"("key");

-- CreateIndex
CREATE UNIQUE INDEX "index_flipper_gates_on_feature_key_and_key_and_value" ON "flipper_gates"("feature_key", "key", "value");

-- CreateIndex
CREATE INDEX "notifications_user_id_state_idx" ON "notifications"("user_id", "state");

-- CreateIndex
CREATE INDEX "index_stafftools_role_assignments_on_accounts_user_id" ON "stafftools_role_assignments"("accounts_user_id");

-- CreateIndex
CREATE INDEX "index_stafftools_role_assignments_on_stafftools_role_id" ON "stafftools_role_assignments"("stafftools_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_stafftools_roles_on_name" ON "stafftools_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "index_spaces_on_invite_secret" ON "spaces"("invite_secret");

-- CreateIndex
CREATE INDEX "index_spaces_on_deleted_at" ON "spaces"("deleted_at");

-- CreateIndex
CREATE INDEX "index_spaces_on_owner_id" ON "spaces"("owner_id");

-- AddForeignKey
ALTER TABLE "active_storage_attachments" ADD CONSTRAINT "fk_rails_c3b3935057" FOREIGN KEY ("blob_id") REFERENCES "active_storage_blobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "active_storage_variant_records" ADD CONSTRAINT "fk_rails_993965df05" FOREIGN KEY ("blob_id") REFERENCES "active_storage_blobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discussion_conversations" ADD CONSTRAINT "discussion_conversations_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "accounts_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_comments" ADD CONSTRAINT "discussion_comments_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "accounts_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_comments" ADD CONSTRAINT "discussion_comments_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "discussion_conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "accounts_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stafftools_role_assignments" ADD CONSTRAINT "fk_rails_0e5ee8f5b7" FOREIGN KEY ("accounts_user_id") REFERENCES "accounts_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stafftools_role_assignments" ADD CONSTRAINT "fk_rails_1835425809" FOREIGN KEY ("stafftools_role_id") REFERENCES "stafftools_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
