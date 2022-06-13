# frozen_string_literal: true

# == Schema Information
#
# Table name: users_password_authenticates
#
#  id              :bigint           not null, primary key
#  password_digest :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  user_id         :bigint           not null
#
# Indexes
#
#  index_users_password_authenticates_on_user_id  (user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => pods.id)
#
module Users
  class PasswordAuthenticate < ApplicationRecord
    belongs_to :user, inverse_of: :password_authenticate

    include Argon2Password
    has_argon2_password :password

    # Find by username
    def self.find_by_username(username)
      user = User.find_by(username: username)
      user&.password_authenticate
    end
  end
end
