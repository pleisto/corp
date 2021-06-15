# frozen_string_literal: true

module Brickdoc
  module Crdt
    module Callbacks
      class Echo < Brickdoc::Crdt::Callback
        def self.before_invoke_async(obj)
          obj.logger.info("[CALLBACK] before_invoke_async")
        end

        def self.before_invoke_sync(obj)
          obj.logger.info("[CALLBACK] before_invoke_sync")
        end

        def self.after_invoke_sync(obj)
          obj.logger.info("[CALLBACK] after_invoke_sync")
        end

        def self.after_invoke_async(obj)
          obj.logger.info("[CALLBACK] after_invoke_async")
        end
      end
    end
  end
end
