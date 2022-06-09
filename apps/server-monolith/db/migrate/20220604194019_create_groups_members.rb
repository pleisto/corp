# frozen_string_literal: true

class CreateGroupsMembers < ActiveRecord::Migration[7.0]
  def change
    create_table :groups_members do |t|
      t.belongs_to :user, null: false, index: true, foreign_key: { to_table: :pods },
        comment: 'the user who is a member of the group'
      t.belongs_to :group, null: false, index: true, foreign_key: { to_table: :pods },
        comment: 'the group that the user is a member of'
      t.integer :role, null: false, comment: 'enumeration value for the role of the user in the group'
      t.index [:user_id, :group_id], unique: true
      t.timestamps
    end
  end
end
