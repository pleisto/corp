# frozen_string_literal: true

class CreateUsersMagicLinkAuthenticates < ActiveRecord::Migration[7.0]
  def change
    create_table :users_magic_link_authenticates do |t|
      t.belongs_to :user, index: { unique: true }, null: false, foreign_key: { to_table: :pods }
      t.string :email, null: false
      t.index 'lower((email)::text)', unique: true
      t.timestamps
    end
  end
end
