# frozen_string_literal: true

class CreatePods < ActiveRecord::Migration[7.0]
  def change
    create_enum :pod_type, ['User', 'Group']
    create_table :pods, comment: 'Pod is an abstract model used to represent tenants, which can be either users or groups' do |t|
      t.enum :type, enum_type: :pod_type, null: false
      t.string :username, null: false, comment: 'a unique username for the pod'
      t.string :display_name, null: false
      t.string :bio
      t.datetime :suspended_at, index: true, comment: 'the date when the user was suspended'
      t.integer :suspended_reason, comment: 'enumeration value for the reason for the user suspension', default: 0
      t.index 'lower((username)::text)', unique: true
      t.timestamps
    end
  end
end
