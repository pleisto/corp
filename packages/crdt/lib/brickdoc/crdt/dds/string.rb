# frozen_string_literal: true

module Brickdoc
  module Crdt
    module DDS
      module String
        include Brickdoc::Crdt::DDS

        def self.name
          :string
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
