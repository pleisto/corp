# frozen_string_literal: true

module BrickdocAccessControl
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

    # Check whether this actor can perform the ability on the resource
    # Calls block if the check passes
    #
    #   current_user.can?(:edit, doc) do |roles, attrs|
    #     puts "The role of current user in this document is: #{roles}, has attrbutes: #{attrs}"
    #   end
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

    # Grant given ability to this actor of the resource
    def grant!(resource, ability, actor, attrs = {})
      persistor_of_actor(actor).set_persist(resource, actor, attrs) do |value|
        value[:abilities].push ability
      end
    end

    # Revoke given ability from this actor of the resource
    def revoke!(resource, ability, actor, attrs = {})
      persistor_of_actor(actor).set_persist(resource, actor, attrs) do |value|
        value[:abilities].delete ability
      end
    end

    # Add this actor as given role to the resource
    def add_actor!(resource, role, actor, attrs = {})
      persistor_of_actor(actor).set_persist(resource, actor, attrs) do |value|
        value[:roles].push role
      end
    end

    # Remove this actor as given role from the resource
    def remove_actor!(resource, role, actor, attrs = {})
      persistor_of_actor(actor).set_persist(resource, actor, attrs) do |value|
        value[:roles].delete role
      end
    end

    # Get actors on given role of the resource
    def get_actors(resource, role)
      persistor_of_role(role).get_actors(resource, role)
    end
  end
end
