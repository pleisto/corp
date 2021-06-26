# frozen_string_literal: true
module Docs
  class Mutations::BlockSync < BrickGraphQL::BaseMutation
    argument :block, Scalars::UntypedBlock, description_same(Objects::Block), required: true
    def resolve
    end
  end
end
