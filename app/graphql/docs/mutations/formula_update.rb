# frozen_string_literal: true
module Docs
  class Mutations::FormulaUpdate < BrickGraphQL::BaseMutation
    argument :block_id, BrickGraphQL::Scalars::UUID, 'block id', required: true
    argument :id, BrickGraphQL::Scalars::UUID, 'id', required: true
    argument :name, String, 'name', required: false
    argument :definition, String, 'definition', required: false
    argument :view, GraphQL::Types::JSON, 'view', required: false
    argument :dependency_ids, [BrickGraphQL::Scalars::UUID], 'dependencies', required: false
    argument :value, String, 'dump value', required: false
    argument :type, String, 'type', required: false

    def resolve(args)
      formula = Docs::Formula.find_by!(id: args[:id], block_id: args[:block_id])

      update_params = {
        name: args[:name],
        definition: args[:definition],
        view: args[:view],
        dependency_ids: args[:dependency_ids],
        value: args[:value],
        type: args[:type]
      }.compact
      formula.update!(update_params)

      nil
    rescue => e
      raise BrickGraphQL::Errors::ArgumentError, e.message
    end
  end
end
