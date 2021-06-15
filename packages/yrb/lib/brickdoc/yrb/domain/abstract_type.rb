# frozen_string_literal: true

module Brickdoc
  module Yrb
    module Domain
      class YEventArgs
        def initialize(evt, transaction)
          @event = evt
          @transaction = transaction
        end
      end

      class AbstractType
        def initialize
          @_item = nil
          @_start = nil
          @_map = {}

          @doc = nil
          @length = 0
        end
      end
    end
  end
end
