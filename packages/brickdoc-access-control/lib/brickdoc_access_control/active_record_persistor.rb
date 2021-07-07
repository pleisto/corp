# frozen_string_literal: true

module BrickdocAccessControl
  module ActiveRecordPersistor
    extend ActiveSupport::Concern

    module ClassMethods
      include BrickdocAccessControl::PersistorBase

      # def get_persist_relation(resource, actor)
      #   where(resource_key: persist_key(resource), actor_key: actor_key(actor))
      # end

      def get_persist(resource, actor)
        get_persist_relation(resource, actor).first&.slice(:roles, :attrs, :abilities)&.symbolize_keys
      end

      def set_persist(resource, actor, attrs = {})
        record = get_persist_relation(resource, actor).first_or_initialize
        persist_value = record.slice(:roles, :abilities).symbolize_keys
        yield persist_value
        record.roles = persist_value[:roles].uniq
        record.abilities = persist_value[:abilities].uniq
        record.attrs = attrs
        record.save
      end
    end
  end
end
