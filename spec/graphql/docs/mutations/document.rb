# frozen_string_literal: true

require 'rails_helper'

describe Docs::Mutations::Document, type: :mutation do
  describe '#resolve' do
    mutation = <<-'GRAPHQL'
      mutation Document($input: DocumentInput!) {
        document(input: $input) {
          errors
        }
      }
    GRAPHQL

    let(:user) { create(:accounts_user) }
    let(:share_user) { create(:accounts_user) }
    let(:block) { create(:docs_block, space: user.personal_space) }

    it 'can save fresh document' do
      self.current_user = user
      self.current_space = user.personal_space.as_session_context

      doc_id = SecureRandom.uuid
      state = Random.bytes(50)
      state_id = SecureRandom.uuid

      input = {
        input: {
          docId:      doc_id,
          operatorId: SecureRandom.uuid,
          state:      Base64.encode64(state),
          stateId:    state_id,
        }
      }
      internal_graphql_execute(mutation, input)

      expect(response.success?).to be(true)
      expect(response.data).to eq({ "document" => nil })

      document = Docs::Document.find(doc_id)
      expect(document.state).to eq(state)
      expect(document.state_id).to eq(state_id)

      self.current_user = nil
      self.current_space = nil
    end
  end
end
