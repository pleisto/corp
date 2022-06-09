# frozen_string_literal: true

class CreateAuditLogs < ActiveRecord::Migration[7.0]
  def change
    create_table :audit_logs do |t|
      t.belongs_to :actor, null: false, index: true, comment: 'the actor who initiated the action', polymorphic: true
      t.belongs_to :resource, null: true, index: true, comment: 'the resource affected by the action', polymorphic: true
      t.column :actor_ip, :inet, comment: 'the IP address of the actor'
      t.string :actor_location,  comment: 'the location of the actor'
      t.column :event, :ltree, null: false, comment: 'the event that occurred'
      t.column :context, :jsonb, null: false, comment: 'the context of the event', default: {}
      t.timestamps
    end
  end
end
