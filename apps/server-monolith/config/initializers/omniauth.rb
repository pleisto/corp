# frozen_string_literal: true

OmniAuth.config.logger = Rails.logger
OmniAuth.config.path_prefix = '/users/auth'
OmniAuth.config.on_failure = proc do |env|
  # This will be called when OmniAuth fails to authenticate a request.
  SessionsController.action(:failure).call(env)
end

providers = Brickdoc::Plugins::ServerPlugin::Hooks.oauth_provider do
  # Append built-in providers
  provider(:password) if BrickdocConfig.accounts.password_auth_enabled
  provider(:magic_link) if BrickdocConfig.accounts.magic_link_auth_enabled
end

Rails.application.config.middleware.use OmniAuth::Builder, &providers
