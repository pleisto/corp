# frozen_string_literal: true

module Docs
  module Queries
    class DocHistory < BrickGraphQL::BaseResolver
      type Docs::Objects::DocHistory, null: true

      argument :id, GraphQL::Types::String, required: true, description: 'doc id'
      authenticate_user!

      def resolve(id:)
        # TODO: eager load users
        # TODO: paginate
        histories = Docs::BlockState.where(block_id: id).includes(:user).order('created_at DESC').limit(100).to_a
        {
          histories: histories,
          users: {},
        }
      end
    end
  end
end
