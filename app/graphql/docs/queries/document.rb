# frozen_string_literal: true

module Docs
  class Queries::Document < BrickGraphQL::BaseResolver
    type Docs::Objects::Document, null: true

    argument :id, GraphQL::Types::String, required: true,
             description: 'document id'

    def resolve(id:)
      Docs::Document.find_by(id: id)
    end
  end
end
