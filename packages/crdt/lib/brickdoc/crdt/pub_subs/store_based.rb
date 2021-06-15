# frozen_string_literal: true

module Brickdoc
  module Crdt
    module PubSubs
      class StoreBased < Brickdoc::Crdt::PubSub
        attr_reader :store

        def initialize(doc)
          @store = doc.store
          super
        end

        def subscribe(actor)
          store.array_add("global", "subscriber", actor)
        end

        def unsubscribe(actor)
          store.array_remove("global", "subscriber", actor)
        end

        def presence
          store.data_get("global", "subscriber").to_a
        end

        def broadcast(change)
          ## TODO presence
          store.array_add("global", "notifications", change, uniq: false)
        end
      end
    end
  end
end
