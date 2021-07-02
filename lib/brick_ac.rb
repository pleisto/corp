# frozen_string_literal: true

module BrickAc
  class << self
    def for_actor(cls, *args, &block)
      @actors ||= {}
      @actors[cls] ||= ActorAc.new(cls, *args)
      @actors[cls].instance_eval(&block)
    end
  end

  module AcActorConcern
    extend ActiveSupport::Concern

    included do
      class << self
        attr_accessor :actor_ac
      end
    end

    def can?(ability, resource)
      self.class.actor_ac.can?(self, ability, resource)
    end
  end

  module AcResourceConcern
    extend ActiveSupport::Concern

    included do
      class << self
        attr_accessor :actors_acs
      end
      self.actors_acs ||= {}
    end

    def grant!(actor, roles, attrs = {})
      self.class.actors_acs[actor.class].grant!(actor, self, roles, attrs)
    end
  end

  class AcBase
    attr_reader :ac_options

    def initialize(*_)
      @ac_options = {}
    end

    def persist_to(persist_to)
      @ac_options[:persist_to] = persist_to
    end
  end

  class ActorAc < AcBase
    attr_reader :actor_cls

    def initialize(cls)
      super
      @actor_cls = cls
      @resources = {}

      actor_ac = self
      @actor_cls.instance_eval do
        include AcActorConcern
        self.actor_ac = actor_ac
      end
    end

    def to(cls, *args, &block)
      @resources[cls] ||= ResourceAc.new(self, cls, *args)
      @resources[cls].instance_eval(&block)
    end

    def can?(actor, ability, resource)
      @resources[resource.class]&.can?(actor, ability, resource)
    end

    def grant!(actor, resource, roles, attrs = {})
      @resources[resource.class].grant!(resource, actor, roles, attrs)
    end
  end

  class ResourceAc < AcBase
    attr_reader :resource_cls

    def initialize(actor_ac, cls)
      super
      @actor_ac = actor_ac
      @ac_options = actor_ac.ac_options.merge(@ac_options)
      @resource_cls = cls
      @roles = []
      @permissions = {}

      @resource_cls.instance_eval do
        include AcResourceConcern
        self.actors_acs[actor_ac.actor_cls] = actor_ac
      end
    end

    def roles(*roles)
      @roles = roles
    end

    def permit(ability, options = {}, &block)
      options[:roles] ||= [options[:role]] if options[:role].present?
      @permissions[ability] = options.merge(block: block)
    end

    def can?(actor, ability, resource)
      can = true
      permission = @permissions[ability]
      if permission
        require_roles = permission[:roles]
        persist_value = @ac_options[:persist_to]&.get_persist(actor, resource)
        if can && require_roles.present?
          can &&= persist_value.present? && (persist_value[:roles] & require_roles).present?
        end
        block = permission[:block]
        if can && block.present?
          can &&= block.call(actor, resource, persist_value[:roles], persist_value[:attrs])
        end
      end
      can && true
    end

    def grant!(actor, resource, roles, attrs = {})
      roles = [roles] unless roles.is_a?(Array)
      @ac_options[:persist_to].set_persist(resource, actor, roles, attrs)
    end
  end
end
