# frozen_string_literal: true

module Brickdoc
  module Yrb
    module Domain
      class Snapshot
        def initialize(ds, state_map)
          @delete_set = ds
          @state_vector = state_map
        end

        def restore_document(original_doc, _opts = nil)
          if original_doc.gc
            raise("originDoc must not be garbage collected")
          end
        end
      end
    end
  end
end
