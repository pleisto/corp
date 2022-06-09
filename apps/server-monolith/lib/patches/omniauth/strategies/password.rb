# frozen_string_literal: true

module OmniAuth
  module Strategies
    class Password
      include OmniAuth::Strategy
      include OmniAuth::LocalFormStrategy

      def request_phase
        user_fail!(:bad_request, 'Please post the form data directly to the callback URL')
      end

      uid do
        request.params[options.uid_field.to_s]
      end
    end
  end
end
