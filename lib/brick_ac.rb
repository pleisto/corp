# frozen_string_literal: true

module BrickAc
  class << self
    def for_actor(cls, *args, &block)
      @actors ||= {}
      @actors[cls] ||= ActorAc.new(cls, *args)
      @actors[cls].instance_eval(&block)
    end
  end

  class ActorAc
    def initialize(cls)
      @actor_cls = cls
      @resources = {}
      actor_ac = self
      cls.instance_eval do
        define_method :can? do |ability, resource|
          actor_ac.can?(self, ability, resource)
        end
      end
    end

    def to(cls, *args, &block)
      @resources[cls] ||= ResourceAc.new(cls, *args)
      @resources[cls].instance_eval(&block)
    end

    def can?(actor, ability, resource)
      @resources[resource.class]&.can?(actor, ability, resource)
    end
  end

  class ResourceAc
    def initialize(cls)
      @resource_cls = cls
      @roles = []
      @permissions = {}
    end

    def roles(*roles)
      @roles = roles
    end

    def permit(ability, options = {}, &block)
      @permissions[ability] = options.merge(block: block)
    end

    def can?(actor, ability, resource)
      permission = @permissions[ability].presence
      if permission
        actor && resource
      end
    end
  end
end
