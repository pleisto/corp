# frozen_string_literal: true

class BrickdocPlugin::DummyPlugin::Engine < Rails::Engine
  isolate_namespace BrickdocPlugin
end

# TODO: change plugins load order for keep out devise injection
BrickdocPlugin::DummyPlugin::Engine.routes.instance_variable_set :@devise_finalized, true

BrickdocPlugin::DummyPlugin::Engine.routes.draw do
  resources :echo
end

# TODO: better interface makes it easy for plugin to insert own RouteSet before rule `/*path` 
Rails.application.routes.prepend do
  mount BrickdocPlugin::DummyPlugin::Engine => "/dummy"
end
