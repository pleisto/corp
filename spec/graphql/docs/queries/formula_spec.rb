# frozen_string_literal: true

require 'rails_helper'

describe Docs::Queries::Formulas, type: :query do
  describe '#resolver' do
    query = <<-'GRAPHQL'
      query GetFormulas($webid: String!) {
        formulas(webid: $webid) {
          id
          name
          view
          type
          value
          blockId
          definition
          dependencyIds
          updatedAt
          createdAt
        }
      }
    GRAPHQL

    it 'normal' do
      user = create(:accounts_user)
      self.current_user = user
      self.current_pod = user.personal_pod.as_session_context

      block = create(:docs_block, pod: user.personal_pod)
      formula = Docs::Formula.create!(
        block_id: block.id, id: SecureRandom.uuid, name: 'foo',
        view: {}, dependency_ids: [], type: 'any', definition: "=123", value: "123"
      )

      internal_graphql_execute(query, { webid: block.pod.webid })
      expect(response.success?).to be true
      expect(response.data['formulas'].count).to eq(1)
      expect(response.data['formulas'][0].slice!('updatedAt', 'createdAt')).to eq({
        'id' => formula.id,
        'blockId' => formula.block_id,
        'name' => formula.name,
        'view' => formula.view,
        'definition' => formula.definition,
        'dependencyIds' => formula.dependency_ids,
        'type' => formula.type,
        'value' => formula.value
      })
    end
  end
end
