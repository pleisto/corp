# frozen_string_literal: true

module Brickdoc
  module Yrb
    module Domain
      class Id
        attr_reader :client, :clock

        def initialize(client, clock)
          @client = client
          @clock = clock
        end
      end
    end
  end
end
