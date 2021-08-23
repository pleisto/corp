# frozen_string_literal: true

module System
  class Queries::Plugins < BrickGraphQL::BaseResolver
    description 'return all plugins for user.'
    type [System::Objects::Plugin], null: false
    authenticate_user!

    def resolve
      BrickdocPlugin.all_plugins.map do |_name, plugin|
        plugin.attributes
      end
    end
  end
end
