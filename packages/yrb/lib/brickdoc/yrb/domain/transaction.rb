# frozen_string_literal: true

module Brickdoc
  module Yrb
    module Domain
      class Transaction
        def initialize(doc, origin, local)
          @doc = doc
          @delete_set = DeleteSet.new
          @before_state = doc.store.state_vector
          @after_state = {}
          @changed = {}
          @changed_parent_types = {}
          @_merge_structs = []
          @origin = origin
          @local = local
          @meta = {}
          @sub_docs_added = Set.new
          @sub_docs_removed = Set.new
          @sub_docs_loaded = Set.new
        end

        def self.cleanup_transactions(ary, index)
        end
      end
    end
  end
end
