# frozen_string_literal: true

class RootMutation < BrickGraphQL::BaseObject
  field :block_commit, mutation:  Docs::Mutations::BlockCommit
  field :block_create, mutation:  Docs::Mutations::BlockCreate
  field :block_create_share_link, mutation: Docs::Mutations::BlockCreateShareLink
  field :block_create_snapshot, mutation: Docs::Mutations::BlockCreateSnapshot
  field :block_duplicate, mutation: Docs::Mutations::BlockDuplicate
  field :block_hard_delete, mutation: Docs::Mutations::BlockHardDelete
  field :block_move, mutation: Docs::Mutations::BlockMove
  field :block_pin_or_unpin, mutation: Docs::Mutations::BlockPinOrUnpin
  field :block_rename, mutation: Docs::Mutations::BlockRename
  field :block_restore, mutation: Docs::Mutations::BlockRestore
  field :block_soft_delete, mutation: Docs::Mutations::BlockSoftDelete
  field :block_sync_batch, mutation:  Docs::Mutations::BlockSyncBatch
  field :conversation_comment_append, mutation: Docs::Mutations::ConversationCommentAppend
  field :conversation_comment_create, mutation: Docs::Mutations::ConversationCommentCreate
  field :create_direct_upload, mutation: System::Mutations::CreateDirectUpload
  field :create_or_update_space, mutation: System::Mutations::CreateOrUpdateSpace
  field :formula_commit, mutation: Docs::Mutations::FormulaCommit
  field :join_space, mutation: System::Mutations::JoinSpace
  field :snapshot_restore, mutation: Docs::Mutations::SnapshotRestore
  field :space_destroy, mutation: System::Mutations::SpaceDestroy
  field :space_leave, mutation: System::Mutations::SpaceLeave
  field :sync_document, mutation: Docs::Mutations::SyncDocument
  field :update_domain, mutation: System::Mutations::UpdateDomain
  field :update_member, mutation: System::Mutations::UpdateMember
  field :user_appearance_update, mutation: Accounts::Mutations::UserAppearanceUpdate
  field :user_destroy, mutation: Accounts::Mutations::UserDestroy
end
