# frozen_string_literal: true

require 'rails_helper'

describe Docs::Queries::SpreadsheetBlocks, type: :query do
  describe '#resolver' do
    it 'can query all row under a spreadsheetBlock block' do
      user = create(:accounts_user)
      self.current_user = user
      pod = create(:pod)
      self.current_pod = pod.as_session_context

      parent_block = create(:docs_block, pod: pod, type: 'spreadsheetBlock', collaborators: [user.id])
      _rows_blocks = 10.times { create(:docs_block, pod: pod, type: 'spreadsheetRow', parent: parent_block) }

      # block
      query = <<-'GRAPHQL'
        query GetSpreadsheetBlocks($parent_id: String!, $snapshot_version: Int!) {
          spreadsheetBlocks(parentId: $parent_id, snapshotVersion: $snapshot_version) {
            id
          }
        }
      GRAPHQL

      internal_graphql_execute(query, { parent_id: parent_block.id, snapshot_version: 0 })

      expect(response.success?).to be true
      expect(response.data['spreadsheetBlocks'].length).to eq 10
    end
  end
end
