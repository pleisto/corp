# frozen_string_literal: true

# == Schema Information
#
# Table name: pods
#
#  id                                                                         :bigint           not null, primary key
#  bio                                                                        :string
#  display_name                                                               :string           not null
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
class User < Pod
  has_many :identities, dependent: :destroy, class_name: 'Users::Identity'
  has_many :group_members, class_name: 'Groups::Member', dependent: :destroy
  has_many :groups, through: :group_members
  has_many :owned_groups,
    # don't destroy the user if it is owner of a group
    -> { where(role: :owner) }, through: :group_members, source: :group, dependent: :restrict_with_exception
  has_many :aduit_logs, class_name: 'AuditLog', as: :actor, dependent: :nil
  has_many :notifications, class_name: 'Users::Notification', dependent: :destroy

  # Built-in authentication providers
  has_one :password_authenticate, class_name: 'Users::PasswordAuthenticate', dependent: :destroy
  has_one :magic_link_authenticate, class_name: 'Users::MagicLinkAuthenticate', dependent: :destroy
end
