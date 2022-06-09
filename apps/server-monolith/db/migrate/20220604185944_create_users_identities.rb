# frozen_string_literal: true

class CreateUsersIdentities < ActiveRecord::Migration[7.0]
  def change
    create_table :users_identities, comment: 'stores user authentication provider data' do |t|
      t.belongs_to :user, null: false, index: true, foreign_key: { to_table: :pods },
        comment: 'the user that owns the identity'
      t.string :provider, null: :false, comment: 'the authentication provider'
      t.string :subject, null: false, comment: 'the unique identifier for the user on the provider'
      t.jsonb :meta, null: false, default: {},
        comment: 'meta is a JSON object that contains extra information about the user in the provider'

      t.timestamps
      t.index [:user_id, :provider], unique: true
    end
  end
end
