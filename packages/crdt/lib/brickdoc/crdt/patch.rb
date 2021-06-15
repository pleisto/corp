# frozen_string_literal: true

module Brickdoc
  module Crdt
    class Patch
      attr_reader :code, :result, :callback_obj, :broadcast, :content

      def initialize(code:, result:, callback_obj:)
        @code = code
        @result = result
        @callback_obj = callback_obj
        @broadcast = true
        @content = "TODO"
      end
    end
  end
end
