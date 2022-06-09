# frozen_string_literal: true

# == Schema Information
#
# Table name: users_identities
#
#  id                                                                                         :bigint           not null, primary key
#  meta(meta is a JSON object that contains extra information about the user in the provider) :jsonb            not null
#  provider(the authentication provider)                                                      :string
#  subject(the unique identifier for the user on the provider)                                :string           not null
#  created_at                                                                                 :datetime         not null
#  updated_at                                                                                 :datetime         not null
#  user_id(the user that owns the identity)                                                   :bigint           not null
#
# Indexes
#
#  index_users_identities_on_user_id               (user_id)
#  index_users_identities_on_user_id_and_provider  (user_id,provider) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => pods.id)
#
module Users
  class Identity < ApplicationRecord
    belongs_to :user, inverse_of: :identities

    class << self
      # Returns the array of the auth providers that enabled on server.
      def providers_settings
        providers = OmniAuth::Builder.providers
        # Get the enabled preferred providers
        preferred_providers = BrickdocConfig.accounts.preferred_auth_providers.filter_map do |name|
          id = Brickdoc::Plugins.name_to_id(name)
          if providers.key?(id)
            id
          else
            Rails.logger.warn("Currently preferred auth provider #{name} is unavailable.")
            nil
          end
        end

        # If preferred auth providers are not set, use the first provider as fallback.
        if preferred_providers.empty?
          fallback = providers.keys.first
          Rails.logger.warn("Available preferred auth providers is empty. Use #{fallback} as fallback.")
          preferred_providers.push(fallback)
        end

        providers.to_a
          # Make sure the providers sort same as the preferred_providers
          .sort_by { |name, _| preferred_providers.index(name) || 999 }
          # Append preferred attributes to the provider and return the array.
          .map { |name, provider| provider.merge({ preferred: preferred_providers.include?(name) }) }
      end

      # Checks if the provider is supported.
      # @param id [String] the provider id
      # @return [Boolean]
      def provider?(id)
        OmniAuth::Builder.providers.values.map { |p| p[:id].to_s }.include?(id.to_s)
      end
    end
  end
end
