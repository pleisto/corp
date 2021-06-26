# frozen_string_literal: true
module Docs
  class Objects::BlockBaseObject < BrickGraphQL::BaseObject
    has_primary_key uuid: true

    field :type, String, 'block type', null: false
    field :parent_id, BrickGraphQL::Scalars::UUID, 'parent uuid', null: true
    field :parent_type, String, 'parent type', null: true
    field :sort, Float, 'block sort', null: false
    field :collaborators, [Accounts::Objects::User], 'collaborators', null: true

    def self.create_object(&block)
      Class.new(BrickGraphQL::BaseObject, &block)
    end
  end
end
