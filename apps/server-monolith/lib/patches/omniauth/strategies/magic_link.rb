# frozen_string_literal: true

module OmniAuth
  module Strategies
    class MagicLink
      include OmniAuth::Strategy
      include OmniAuth::LocalFormStrategy
      option :name, :magic_link
      option :fields, [:email]
      option :uid_field, :email

      def request_phase
        email = request_email
        # Check if the email is valid
        unless Brickdoc::Validators::EmailValidator::REGEXP.match?(email)
          magic_link = model.new
          magic_link.errors.add :email, ::I18n.t('errors.messages.email_invalid')
          return vaildate_fail! magic_link.errors
        end

        model.send!(email)
        redirect "/users/auth/magic_link/sent?e=#{Brickdoc::Utils::Encoding::Base58.encode(email)}"
      end

      def callback_phase
        email = Users::MagicLinkAuthenticate.consume_token!(request.params['token'])
        return invalid_token! if email.blank?

        @validated_email = email
        super
      end

      uid do
        @validated_email
      end

      info do
        {
          email: @validated_email,
          name: @validated_email.split('@').first,
        }
      end

      protected

      def model
        Users::MagicLinkAuthenticate
      end

      def request_email
        @req_email ||= Oj.load(request.body.read)['email']
      rescue
        nil
      end

      def invalid_token!
        fail!(:invalid_token, ArgumentError.new(::I18n.t('users.auth_providers.magic_link.invalid_token')))
      end
    end
  end
end
