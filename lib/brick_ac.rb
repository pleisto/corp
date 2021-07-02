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

    def can?(ability, resource, &block)
      self.class.actor_ac.can?(self, ability, resource, &block)
    end
  end

  module AcResourceConcern
    extend ActiveSupport::Concern

    included do
      class << self
        attr_accessor :resource_ac
      end
    end

    def grant!(actor, role, attrs = {})
      self.class.resource_ac.grant!(self, actor, role, attrs)
    end

    def actors(role)
      self.class.resource_ac.get_actors(self, role)
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
      @resources[cls] ||= ResourceAc.new(cls, *args)
      @resources[cls].current_actor_ac = self
      @resources[cls].instance_eval(&block)
    end

    def can?(actor, ability, resource, &block)
      @resources[resource.class]&.can?(actor, ability, resource, &block)
    end

    def get_actors(resource, role)
      @resources[resource.class].get_actors(resource, role)
    end
  end

  class ResourceAc < AcBase
    attr_reader :resource_cls

    def initialize(cls)
      super
      @current_actor_ac = nil
      @resource_cls = cls
      @role_to_actors = {}
      @cls_to_actors = {}
      @permissions = {}

      resource_ac = self
      @resource_cls.instance_eval do
        include AcResourceConcern
        self.resource_ac = resource_ac
      end
    end

    def persistor_of_actor(actor)
      @ac_options[[:persistor] || @cls_to_actors[actor.class].ac_options[:persistor]
    end

    def persistor_of_role(role)
      @ac_options[[:persistor] || @role_to_actors[role].ac_options[:persistor]
    end

    def current_actor_ac=(actor_ac)
      @current_actor_ac = actor_ac
      @cls_to_actors[actor_ac.actor_cls] = actor_ac
    end

    def roles(*roles)
      roles.each do |role|
        @role_to_actors[role] = @current_actor_ac
      end
    end

    def permit(ability, options = {}, &block)
      options[:roles] ||= [options[:role]] if options[:role].present?
      @permissions[ability] = options.merge(block: block)
    end

    def can?(actor, ability, resource, &block)
      can = true
      permission = @permissions[ability]
      if permission
        require_roles = permission[:roles]
        persist_value = persistor_of_actor(actor).get_persist(actor, resource)
        if can && require_roles.present?
          can &&= persist_value.present? && (persist_value[:roles] & require_roles).present?
        end
        check_block = permission[:block]
        if can && check_block.present?
          can &&= check_block.call(actor, resource, persist_value[:roles], persist_value[:attrs])
        end
      end
      if can && block
        block.call(persist_value[:roles], persist_value[:attrs])
      end
      can && true
    end

    def grant!(resource, actor, role, attrs = {})
      persistor_of_role(role).set_persist(actor, resource, role, attrs)
    end

    def get_actors(resource, role)
      persistor_of_role(role).get_actors(resource, role)
    end
  end
end
