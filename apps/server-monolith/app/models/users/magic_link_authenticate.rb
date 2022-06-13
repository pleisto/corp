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

    # Send Magic Link to user
    def self.send!(email)
      # When sign up is disabled, only allow sending magic link to registered users.
      # However, for security reason, do not throw error to prevent it being used to
      # check user existence.
      is_sign_up = !exists?(email: email)
      return if !BrickdocConfig.accounts.sign_up_enabled && is_sign_up

      token = create_token!(email)
      UserMailer.with(token: token, is_sign_up: is_sign_up, email: email).magic_link.deliver_later
    end

    # Generate a magic link token and store it in Redis
    # @param [String] email
    # @return [String] token
    def self.create_token!(email)
      token = Brickdoc::Utils::Encoding::UUID.gen_short
      Brickdoc::Redis.with(:state) { |redis| redis.setex(redis_key_for(token), 30.minutes.in_seconds, email) }
      token
    end

    # Find and revoke the magic link token
    # @param [String] token
    # @return [String|NilClass] if found, return the email, otherwise return nil
    def self.consume_token!(token)
      return nil if token.blank?

      Brickdoc::Redis.with(:state) { |redis| redis.getdel(redis_key_for(token)) }
    end

    def self.redis_key_for(token)
      "magic_link_authenticate:#{token}"
    end
  end
end
