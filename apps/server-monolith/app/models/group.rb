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
#  suspended_reason(enumeration value for the reason for the user suspension) :integer          default("suspended_by_admin")
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
class Group < Pod
  has_many :members, class_name: 'Groups::Member', dependent: :destroy
  has_many :users, through: :members
  has_one :owner, -> { where(role: :owner) }, through: :members, source: :user
end
