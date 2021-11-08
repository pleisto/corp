# frozen_string_literal: true
module Docs
  class Objects::Formula < BrickGraphQL::BaseObject
    has_primary_key uuid: true
    field :name, String, 'formula name', null: false
    field :block_id, BrickGraphQL::Scalars::UUID, 'block id', null: false
    field :definition, String, 'formula definition', null: false
    field :dependency_ids, [BrickGraphQL::Scalars::UUID], 'formula dependencies', null: false
    field :value, String, "dump value", null: true
    field :type, String, 'type', null: false
    field :view, GraphQL::Types::JSON, 'formula name', null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, 'updated at', null: false
    field :created_at, Integer, 'created at', null: false
  end
end
