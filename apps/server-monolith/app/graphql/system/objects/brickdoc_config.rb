# frozen_string_literal: true

module System
  module Objects
    class BrickdocConfig < BrickGraphQL::BaseObject
      graphql_name 'config'
      description 'Brickdoc Global Configuration'

      # TODO: refactor this
      field :user_agreement_link, BrickGraphQL::Scalars::HttpUrl, 'User agreement link', null: false
    end
  end
end
