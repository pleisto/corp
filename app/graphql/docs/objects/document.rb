# frozen_string_literal: true
module Docs
  module Objects
    class Document < BrickGraphQL::BaseObject
      graphql_name 'Document'
      description 'Brickdoc Docs::Document'

      has_primary_key uuid: true
      field :state, String, null: true

      def state
        Base64.encode64 object.state
      end
    end
  end
end
