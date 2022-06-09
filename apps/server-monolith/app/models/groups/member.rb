# frozen_string_literal: true

# == Schema Information
#
# Table name: groups_members
#
#  id                                                            :bigint           not null, primary key
#  role(enumeration value for the role of the user in the group) :integer          not null
#  created_at                                                    :datetime         not null
#  updated_at                                                    :datetime         not null
#  group_id(the group that the user is a member of)              :bigint           not null
#  user_id(the user who is a member of the group)                :bigint           not null
#
# Indexes
#
#  index_groups_members_on_group_id              (group_id)
#  index_groups_members_on_user_id               (user_id)
#  index_groups_members_on_user_id_and_group_id  (user_id,group_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (group_id => pods.id)
#  fk_rails_...  (user_id => pods.id)
#
module Groups
  class Member < ApplicationRecord
    belongs_to :group, class_name: 'Group', inverse_of: :members
    belongs_to :user, class_name: 'User', inverse_of: :group_members

    ROLES = {
      owner: 0,
      member: 1,
    }
    enum role: ROLES
  end
end
