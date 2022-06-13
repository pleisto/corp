# frozen_string_literal: true

module OmniAuth
  module Strategies
    class Password
      include OmniAuth::Strategy
      include OmniAuth::LocalFormStrategy
      option :fields, [:username]
      option :uid_field, :username

      def request_phase
        fail!(:bad_request, ::I18n.t('users.auth_providers.password.bad_request'))
      end

      def callback_phase
        @user = Users::PasswordAuthenticate.find_by_username(request_data['username'])
          &.authenticate(request_data['password'])
        return invalid_credentials! if @user.blank?

        super
      end

      uid do
        @user.id
      end

      info do
        {
          name: @user.display_name,
          username: @user.username,
        }
      end

      protected

      def request_data
        @req_data ||= Oj.load(request.body.read)
      rescue
        nil
      end

      def invalid_credentials!
        # Clear the body to prevent the ActionDispatch::Http::Parameters::ParseError
        env[Rack::RACK_INPUT].rewind

        payload = Users::PasswordAuthenticate.new
        payload.errors.add :password, ::I18n.t('users.auth_providers.password.invalid_credentials')
        vaildate_fail! payload.errors
      end
    end
  end
end
