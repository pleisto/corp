# frozen_string_literal: true

# == Schema Information
#
# Table name: pods
#
#  id                                                                         :bigint           not null, primary key
#  bio                                                                        :string
#  display_name                                                               :string           not null
#  external_avatar_url                                                        :string
#  suspended_at(the date when the user was suspended)                         :datetime
#  suspended_reason(enumeration value for the reason for the user suspension) :integer          default(0)
#  type                                                                       :enum             not null
#  username(a unique username for the pod)                                    :string           not null
#  created_at                                                                 :datetime         not null
#  updated_at                                                                 :datetime         not null
#
# Indexes
#
#  index_pods_on_lower_username_text  (lower((username)::text)) UNIQUE
#  index_pods_on_suspended_at         (suspended_at)
#
class Pod < ApplicationRecord
  validates :username, presence: true, uniqueness: { case_sensitive: false }, username: true
  validates :display_name, presence: true

  # Avatar
  has_one_attached :avatar
  validates :avatar, file_size: { less_than: 5.megabytes },
    file_content_type: { allow: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'] },
    if: -> { avatar.attached? }

  def avatar_url
    Rails.cahce.fetch([cache_key_with_version, 'avatar_url']) do
      avatar.attached? ? avatar.blob.url : external_avatar_url
    end
  end

  # Suspend a pod.
  enum suspended_reason: {
    suspended_by_admin: 0, # Default reason for self-hosted sites
    account_security_at_risk: 1,
    tos_violation_or_spam: 2,
    dmca_takedown: 3,
  }

  # Check if the username available(case-insensitive)
  # @param [String] username
  # @return [Boolean]
  def self.username_available?(username)
    instance = new
    instance.username = username.downcase
    instance.valid?
    instance.errors && instance.errors[:username].present? ? false : true
  end

  # Suggested username for the user
  def self.suggested_username(name)
    # Returns an array that is sorted by length of the username
    suggests = Brickdoc::Utils::Pod.to_username(name)
    exists = where(username: suggests).select(:username)
    # Remove the username that is already taken and return the first one
    (suggests - exists).first
  end
end
