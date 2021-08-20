# frozen_string_literal: true
module BrickdocPlugin::DummyPlugin::Engine
  class EchoController < ActionController::Base
    def index
      render json: { foo: :bar }
    end
  end
end
