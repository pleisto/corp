# frozen_string_literal: true

module BrickdocAccessControl
  module AcActorConcern
    extend ActiveSupport::Concern

    included do
      class << self
        attr_accessor :actor_ac
      end
    end

    def can?(ability, resource, &block)
      self.class.actor_ac.can?(self, ability, resource, &block)
    end
  end

  class ActorAc < AcBase
    attr_reader :actor_cls

    def initialize(cls)
      super
      @actor_cls = cls
      @resources = {}
    end

    def to(cls, *args, &block)
      cls.include(AcResourceConcern) unless cls.include?(AcResourceConcern)
      cls.resource_ac ||= ResourceAc.new(cls, *args)
      @resources[cls] = cls.resource_ac
      cls.resource_ac.current_actor_ac = self
      cls.resource_ac.instance_eval(&block)
    end

    def can?(actor, ability, resource, &block)
      @resources[resource.class]&.can?(actor, ability, resource, &block)
    end
  end
end
