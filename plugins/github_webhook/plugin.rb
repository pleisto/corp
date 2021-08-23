# frozen_string_literal: true

settings do
  field :test_plugin_key, default: 'value2'
end

on :test_hook do |arg|
  arg[:done] = true
end

on :test_autoload do |arg|
  arg[:lib] = BrickdocPlugin::GithubWebhook::TEST_LOAD
  arg[:model] = BrickdocPlugin::GithubWebhook::Test::TEST_LOAD
end

load_engine!
