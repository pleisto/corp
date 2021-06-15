# frozen_string_literal: true

module Brickdoc
  module Crdt
    class Callback
      attr_reader :document_identity_obj, :fragment_identity_obj, :payload
      attr_accessor :change, :code, :result

      def initialize(document_identity_obj:, fragment_identity_obj:, payload:)
        @document_identity_obj = document_identity_obj
        @fragment_identity_obj = fragment_identity_obj
        @payload = payload
        @logger = Brickdoc::Crdt.configuration.logger
      end

      def self.callbacks
        Brickdoc::Crdt.configuration.callbacks
      end

      def self.call(action, obj)
        callbacks.reduce([0, "ok"]) do |result, callback_klass|
          break "[#{action}] #{result}" unless result.first.zero?

          callback_klass.send(action, obj)
        end
      end

      def self.before_invoke_async(_obj)
        raise("NOT IMPLEMENT!")
      end

      def self.before_invoke_sync(_obj)
        raise("NOT IMPLEMENT!")
      end

      def self.after_invoke_sync(_obj)
        raise("NOT IMPLEMENT!")
      end

      def self.after_invoke_async(_obj)
        raise("NOT IMPLEMENT!")
      end
    end
  end
end
