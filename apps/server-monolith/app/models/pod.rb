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
class Pod < ApplicationRecord
  validates :username, presence: true, uniqueness: { case_sensitive: false }
  validates :display_name, presence: true

  # Suspend a pod.
  enum suspended_reason: {
    suspended_by_admin: 0, # Default reason for self-hosted sites
    account_security_at_risk: 1,
    tos_violation_or_spam: 2,
    dmca_takedown: 3,
  }
end
