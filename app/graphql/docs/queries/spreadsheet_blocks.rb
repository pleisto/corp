# frozen_string_literal: true

module Docs
  class Queries::SpreadsheetBlocks < BrickGraphQL::BaseResolver
    type [Docs::Objects::Block], null: true

    argument :parent_id, GraphQL::Types::String, required: true,
             description: 'List all children from parent id'

    argument :snapshot_version, GraphQL::Types::Int, required: true, description: 'Snapshot version'

    def resolve(parent_id:, snapshot_version:)
      if snapshot_version.zero?
        rows = Docs::Block.where(parent_id: parent_id, type: ['spreadsheetRow']).non_deleted.to_a
        cells = Docs::Block.where(parent_id: rows.map(&:id), type: ['spreadsheetCell']).non_deleted.to_a
        rows + cells
      else
        []
      end
    end
  end
end
