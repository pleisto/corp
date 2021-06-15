# frozen_string_literal: true

module Brickdoc
  module Crdt
    module DDS
      ## https://fluidframework.com/start/faq/#what-is-a-dds
      def self.allow_actions
        raise("NOT IMPLEMENT!")
      end

      def self.name
        raise("NOT IMPLEMENT!")
      end

      def self.merge_policy
        raise("NOT IMPLEMENT!")
      end

      def self.autonomy_policy
        raise("NOT IMPLEMENT!")
      end

      def self.store_apply(change, _method, args)
        change.store.send(change.document_identity_obj, change.fragment_identity_key, *args)
      end

      def self.should_lock?
        true
      end
    end
  end
end
