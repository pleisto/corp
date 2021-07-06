# frozen_string_literal: true

module BrickdocAccessControl
  module PersistorBase
    def actor_key(actor)
      return '<anonymous>' if actor.nil?
      persist_key(actor)
    end

    def persist_key(object)
      "#{object.class.name}:#{object.id}"
    end
  end
end
