# frozen_string_literal: true

class BrickdocPlugin::DummyPlugin::Engine < BrickdocPlugin::Engine
  isolate_namespace BrickdocPlugin::DummyPlugin
end

BrickdocPlugin::DummyPlugin::Engine.routes.draw do
  resources :echo
end
