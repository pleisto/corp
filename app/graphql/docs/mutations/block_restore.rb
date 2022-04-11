# frozen_string_literal: true
module Docs
  class Mutations::BlockRestore < BrickGraphQL::BaseMutation
    argument :ids, [BrickGraphQL::Scalars::UUID], 'block unique id', required: true

    def resolve(ids:)
      ids.each do |id|
        Docs::Block.find(id).restore!
      end
      nil
    rescue => e
      raise BrickGraphQL::Errors::ArgumentError, e.message
    end
  end
end
