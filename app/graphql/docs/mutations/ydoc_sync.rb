# frozen_string_literal: true
module Docs
  class Mutations::YdocSync < BrickGraphQL::BaseMutation
    argument :doc_id, BrickGraphQL::Scalars::UUID, 'doc id', required: true
    argument :operator_id, String, 'operator id', required: true
    argument :updates, [Integer], required: true

    def resolve(doc_id:, operator_id:, updates:)
      Rails.logger.info("pub #{doc_id} by #{operator_id} #{updates}")
      # TODO: server-side ydoc persistence
      BrickdocSchema.subscriptions.trigger(:ydoc, { doc_id: doc_id }, {
        operator_id: operator_id,
        updates: updates
      })
      nil
    end
  end
end
