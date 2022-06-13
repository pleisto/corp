# frozen_string_literal: true

class AddExternalAvatarUrlToPods < ActiveRecord::Migration[7.0]
  def change
    add_column :pods, :external_avatar_url, :string
  end
end
