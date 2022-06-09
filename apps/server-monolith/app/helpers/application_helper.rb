# frozen_string_literal: true

module ApplicationHelper
  # Loads js-bundle plugins entrypoint js file.
  def vite_plugin_bundle_tags
    entrypoints = Brickdoc::Plugins::JsBundlePlugin.enabled_entrypoints
    return if entrypoints.blank?

    entrypoints.map do |entrypoint|
      concat javascript_include_tag Brickdoc::Plugins::Vite.get_path(entrypoint), extname: false
    end
  end

  # Get asset url for /apps/server-monolith/app/frontend/assets folder.
  def vite_frontend_asset_path(path)
    url_to_asset Brickdoc::Plugins::Vite.get_path(Rails.root.join('app/frontend/assets', path))
  end

  # Get entrypoint typescript tag for /apps/server-monolith/app/frontend/entrypoints folder.
  def vite_frontend_entrypoint_tag(entrypoint, **options)
    options = { extname: false, crossorigin: :anonymous, type: :module }.merge(options)
    javascript_include_tag Brickdoc::Plugins::Vite.get_path(
      Rails.root.join('app/frontend/entrypoints', entrypoint)
    ), **options
  end

  # Render a partial when it is exist. The main purpose of this method is to
  # as a hooks for a plugin that declares themselves as an extended edition.
  # @param [String] path_to_partial path to partial
  def render_if_exists(path_to_partial)
    path = path_to_partial.is_a?(Hash) ? path_to_partial[:partial] : path_to_partial
    render path_to_partial if lookup_context.find_all(path, [], true).any?
  end
end
