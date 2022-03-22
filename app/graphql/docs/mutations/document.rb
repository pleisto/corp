# frozen_string_literal: true
module Docs
  class Mutations::Document < BrickGraphQL::BaseMutation
    argument :doc_id, BrickGraphQL::Scalars::UUID, 'doc id', required: true
    argument :operator_id, String, 'operator id', required: true
    argument :state, String, 'full state', required: true
    argument :state_id, BrickGraphQL::Scalars::UUID, 'state id', required: true
    argument :previous_state_id, BrickGraphQL::Scalars::UUID, 'previous state id', required: false
    argument :updates, String, 'updates', required: false

    def resolve(doc_id:, operator_id:, state:, state_id:, previous_state_id: nil, updates: nil)
      Rails.logger.info("committing #{doc_id} by #{operator_id}, #{state_id} -> #{previous_state_id} : #{state} #{updates}")
      document = Docs::Document.where(id: doc_id).first_or_initialize

      if document.state_id.blank? || (document.state_id == previous_state_id)
        document.state = Base64.decode64(state)
        document.state_id = state_id
        document.save
      end

      # Rails.logger.info("pub #{doc_id} by #{operator_id} #{updates}")
      # # TODO: server-side ydoc persistence
      # BrickdocSchema.subscriptions.trigger(:ydoc, { doc_id: doc_id }, {
      #   operator_id: operator_id,
      #   updates: updates
      # })
      nil
    end
  end
end
