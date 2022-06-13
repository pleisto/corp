# frozen_string_literal: true

class DropLegacyModels < ActiveRecord::Migration[7.0]
  # rubocop:disable Rails/ReversibleMigration
  def change
    drop_table :accounts_federated_identities
    drop_table :accounts_members
    rename_table :accounts_notifications, :users_notifications
    drop_table :accounts_users
    drop_table :spaces
    remove_column :active_storage_blobs, :space_id
    remove_column :active_storage_blobs, :user_id
    remove_column :active_storage_blobs, :block_id
  end
end
