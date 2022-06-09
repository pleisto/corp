# frozen_string_literal: true

module Accounts
  module Mutations
    class UserDestroy < BrickGraphQL::BaseMutation
      requires_entrypoint_to_be :internal

      def resolve
        success = current_user.destroy_user!
        if success
          # TODO: redirect to login page
          {}
        else
          { errors: errors_on_object(current_user) }
        end
      end
    end
  end
end
