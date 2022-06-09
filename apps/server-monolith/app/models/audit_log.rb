# frozen_string_literal: true

# == Schema Information
#
# Table name: audit_logs
#
#  id                                               :bigint           not null, primary key
#  actor_ip(the IP address of the actor)            :inet
#  actor_location(the location of the actor)        :string
#  actor_type                                       :string           not null
#  context(the context of the event)                :jsonb            not null
#  event(the event that occurred)                   :ltree            not null
#  resource_type                                    :string
#  created_at                                       :datetime         not null
#  updated_at                                       :datetime         not null
#  actor_id(the actor who initiated the action)     :bigint           not null
#  resource_id(the resource affected by the action) :bigint
#
# Indexes
#
#  index_audit_logs_on_actor     (actor_type,actor_id)
#  index_audit_logs_on_resource  (resource_type,resource_id)
#
class AuditLog < ApplicationRecord
  belongs_to :actor, polymorphic: true
  belongs_to :resource, polymorphic: true, optional: true

  # Auditlog can only be created, not updated or destroyed
  def readonly?
    !new_record?
  end
end
