# frozen_string_literal: true
module Docs
  class Scalars::UntypedBlock < BrickGraphQL::BaseScalar
    description "untyped block, used only for Mutations"

    def self.coerce_input(input_value, ctx)
      raise GraphQL::CoercionError, 'type is required' if input_value.type.blank?
      Docs::Objects::Block.resolve_type(input_value, ctx).authorized_new(input_value, ctx)
    end

    def self.coerce_result(ruby_value, _context)
      ruby_value
    end
  end
end
