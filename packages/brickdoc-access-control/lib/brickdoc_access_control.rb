# frozen_string_literal: true

require 'active_support/concern'

module BrickdocAccessControl
  class << self
    def for_actor(cls, *args, &block)
      cls.include(AcActorConcern) unless cls.include?(AcActorConcern)
      cls.actor_ac ||= ActorAc.new(cls, *args)
      cls.actor_ac.instance_eval(&block)
    end
  end

  class AcBase
    attr_reader :ac_options

    def initialize(*_)
      @ac_options = {}
    end

    def persist_to(persistor)
      @ac_options[:persistor] = persistor
    end
  end
end

require 'brickdoc_access_control/resource_ac'
require 'brickdoc_access_control/actor_ac'
