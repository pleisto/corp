# frozen_string_literal: true

module Brickdoc
  module Crdt
    module DDS
      module Map
        ## https://fluidframework.com/docs/apis/map/sharedmap/
        include Brickdoc::Crdt::DDS

        def self.name
          :map
        end

        def self.allow_actions
          [:set, :clear]
        end

        def self.set(change)
          store_apply(change, :data_set, [change.data])
        end

        def self.clear(change)
          store_apply(change, :data_delete, [])
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
