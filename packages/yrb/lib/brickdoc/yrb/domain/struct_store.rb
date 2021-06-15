# frozen_string_literal: true

module Brickdoc
  module Yrb
    module Domain
      class StructStore
        attr_reader :clients

        def initialize
          @clients = {}
          @pending_structs = nil
          @pending_ds = nil
        end

        def state_vector
          clients

          #   clients.each_with_object({}) do |k, v|
          #   end
        end
      end
    end
  end
end
