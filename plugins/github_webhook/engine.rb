# frozen_string_literal: true

class BrickdocPlugin::GithubWebhook::Engine < BrickdocPlugin::Engine
  isolate_namespace BrickdocPlugin::GithubWebhook
end

BrickdocPlugin::GithubWebhook::Engine.routes.draw do
  resources :events
end
