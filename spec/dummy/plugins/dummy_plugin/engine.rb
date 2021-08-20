# frozen_string_literal: true

class BrickdocPlugin::DummyPlugin::Engine < Rails::Engine
  isolate_namespace BrickdocPlugin

  initializer 'dummy.configuration' do |_app|
    Rails.application.routes.append do
      mount BrickdocPlugin::DummyPlugin::Engine => "/dummy"
    end
  end
end

BrickdocPlugin::DummyPlugin::Engine.routes.draw do
  resources :echo
end
