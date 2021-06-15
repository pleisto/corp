# frozen_string_literal: true

module Brickdoc
  module Crdt
    module DDS
      class Cell
        include Brickdoc::Crdt::DDS

        def self.name
          :cell
        end

        def self.allow_actions
          []
        end

        def self.merge_policy
          Brickdoc::Crdt::ConflictResolutionStrategy
        end

        def self.autonomy_policy
          Brickdoc::Crdt::Optimistic
        end
      end
    end
  end
end
