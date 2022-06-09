# frozen_string_literal: true

module OmniAuth
  # Patch OmniAuth::Builder to add providers name list
  class Builder < ::Rack::Builder
    # rubocop:disable Style/ClassVars
    def provider_patch(klass, *args, &block)
      @@providers ||= {}
      options = args.last.is_a?(Hash) ? args.last : {}
      @@providers[options.dig(:vendor) || klass.to_s] = {
        id: klass,
        logo: options.dig(:logo),
      }
      old_provider(klass, *args, &block)
    end
    alias_method :old_provider, :provider
    alias_method :provider, :provider_patch
    class << self
      def providers
        @@providers
      end
    end
  end
end
