# frozen_string_literal: true
require 'active_support/concern'

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

  module AcResourceConcern
    extend ActiveSupport::Concern

    included do
      class << self
        attr_accessor :resource_ac
      end
    end

    [:add_actor!, :remove_actor!, :grant!, :revoke!, :get_actors].each do |method_name|
      define_method method_name do |*args|
        self.class.resource_ac.send method_name, *([self] + args)
      end
    end
  end

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

  class ResourceAc < AcBase
    attr_reader :resource_cls

    def initialize(cls)
      super
      @current_actor_ac = nil
      @resource_cls = cls
      @role_to_actors = {}
      @cls_to_actors = {}
      @permissions = {}
    end

    def persistor_of_actor(actor)
      @ac_options[:persistor] || @cls_to_actors[actor.class].ac_options[:persistor]
    end

    def persistor_of_role(role)
      @ac_options[:persistor] || @role_to_actors[role].ac_options[:persistor]
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
        persist_value = persistor_of_actor(actor).get_persist(resource, actor)
        if can && require_roles.present?
          can &&= persist_value.present? && (persist_value[:roles] & require_roles).present?
        end
        check_block = permission[:block]
        if can && check_block.present?
          can &&= check_block.call(actor, resource, persist_value[:roles], persist_value[:attrs])
        end
        if persist_value
          can ||= persist_value[:abilities].include?(ability)
        end
      end
      if can && block
        block.call(persist_value[:roles], persist_value[:attrs])
      end
      can && true
    end

    def grant!(resource, ability, actor, attrs = {})
      persistor_of_actor(actor).set_persist(resource, actor, attrs) do |value|
        value[:abilities].push ability
      end
    end

    def revoke!(resource, ability, actor, attrs = {})
      persistor_of_actor(actor).set_persist(resource, actor, attrs) do |value|
        value[:abilities].delete ability
      end
    end

    def add_actor!(resource, role, actor, attrs = {})
      persistor_of_actor(actor).set_persist(resource, actor, attrs) do |value|
        value[:roles].push role
      end
    end

    def remove_actor!(resource, role, actor, attrs = {})
      persistor_of_actor(actor).set_persist(resource, actor, attrs) do |value|
        value[:roles].delete role
      end
    end

    def get_actors(resource, role)
      persistor_of_role(role).get_actors(resource, role)
    end
  end
end
