# frozen_string_literal: true

module Docs
  module Objects
    class BlockState < BrickGraphQL::BaseObject
      graphql_name 'blockState'
      description 'Brickdoc Docs::BlockState'

      has_primary_key uuid: true
      field :block_id, BrickGraphQL::Scalars::UUID, null: true
      field :created_at, GraphQL::Types::ISO8601DateTime, 'Created at', null: false
      field :prev_state_id, BrickGraphQL::Scalars::UUID, null: true
      field :state, String
      field :state_type, Enums::Statetype, 'State Type'

      field :username, String, 'Username', null: false

      def state
        object.respond_to?(:state) ? Brickdoc::Utils::Encoding::Base64.strict_encode64(object.state) : nil
      end

      def username
        object.user.name
      end
    end
  end
end
