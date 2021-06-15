# frozen_string_literal: true

module Brickdoc
  module Crdt
    module DDS
      module Counter
        include Brickdoc::Crdt::DDS

        def self.name
          :counter
        end

        def self.allow_actions
          [:add, :remove]
        end

        def self.add(change)
          store_apply(change, :array_add, [change.data])
        end

        def self.remove(change)
          store_apply(change, :array_remove, [change.data])
        end

        def self.merge_policy
          Brickdoc::Crdt::ConflictResolutionStrategy
        end

        def self.autonomy_policy
          Brickdoc::Crdt::Optimistic
        end

        def self.should_lock?
          false
        end
      end
    end
  end
end
