# frozen_string_literal: true

class CreateUsersPasswordAuthenticates < ActiveRecord::Migration[7.0]
  def change
    create_table :users_password_authenticates, comment: 'password authn provider' do |t|
      t.belongs_to :user, index: { unique: true }, null: false, foreign_key: { to_table: :pods }
      t.string :password_digest, null: false
      t.timestamps
    end
  end
end
