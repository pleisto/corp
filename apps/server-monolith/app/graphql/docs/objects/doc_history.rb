# frozen_string_literal: true

module Docs
  module Objects
    class DocHistory < BrickGraphQL::BaseObject
      graphql_name 'docHistory'

      field :histories, [BlockState], 'History States', null: true
      field :users, [System::Objects::ThinUser], 'History Users', null: true
    end
  end
end
