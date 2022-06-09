# frozen_string_literal: true

class Current < ActiveSupport::CurrentAttributes
  attribute :user
  attribute :request_id
  attribute :ip_address

  # legacy
  attribute :timezone, :locale
  attribute :space
  attribute :redis_values
  attribute :paths
end
