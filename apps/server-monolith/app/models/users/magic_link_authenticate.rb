# frozen_string_literal: true

# == Schema Information
#
# Table name: users_magic_link_authenticates
#
#  id         :bigint           not null, primary key
#  email      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_users_magic_link_authenticates_on_lower_email_text  (lower((email)::text)) UNIQUE
#  index_users_magic_link_authenticates_on_user_id           (user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => pods.id)
#
module Users
  class MagicLinkAuthenticate < ApplicationRecord
    belongs_to :user, inverse_of: :magic_link_authenticate
    validates :email, presence: true, uniqueness: { case_sensitive: false }, email: true
  end
end
