# frozen_string_literal: true

require 'active_support/current_attributes'

module BrickdocAccessControl
  class CurrentCache < ActiveSupport::CurrentAttributes
    include PersistorBase
    attribute :check_cache

    def check_key_for(actor, ability, resource)
      "#{actor_key(actor)}>#{ability}>#{persist_key(resource)}"
    end

    def can?(actor, ability, resource, &block)
      self.check_cache ||= {}
      check_key = check_key_for(actor, ability, resource)
      if self.check_cache.key?(check_key)
        return self.check_cache[check_key]
      end
      can = block.call(actor, ability, resource)
      self.check_cache[check_key] = can
    end
  end
end
