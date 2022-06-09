# frozen_string_literal: true

module OmniAuth
  module Strategies
    class MagicLink
      include OmniAuth::Strategy
      include OmniAuth::LocalFormStrategy
      option :name, :magic_link

      def request_phase
        x = Docs::Block.new
        x.validate
        vaildate_fail! x.errors
      end

      protected

      def email
        request.params[:email]
      end
    end
  end
end
