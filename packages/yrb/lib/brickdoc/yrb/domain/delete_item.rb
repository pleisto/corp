# frozen_string_literal: true

module Brickdoc
  module Yrb
    module Domain
      class DeleteItem
        attr_reader :clock, :length

        def initialize(clock, length)
          @clock = clock
          @length = length
        end
      end
    end
  end
end
