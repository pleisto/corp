# frozen_string_literal: true

module Brickdoc
  module Crdt
    class PubSub
      def initialize(_opts)
      end

      def subscribe(_opts)
        raise("NOT IMPLEMENT!")
      end

      def presence
        raise("NOT IMPLEMENT!")
      end

      def broadcast(_opt)
        raise("NOT IMPLEMENT!")
      end

      def unsubscribe(_opts)
        raise("NOT IMPLEMENT!")
      end

      def logger
        @logger ||= Brickdoc::Crdt.configuration.logger
      end
    end
  end
end
