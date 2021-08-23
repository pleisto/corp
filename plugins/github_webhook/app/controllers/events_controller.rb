# frozen_string_literal: true
module BrickdocPlugin::GithubWebhook
  class EventsController < ActionController::Base
    skip_before_action :verify_authenticity_token

    def index
      render json: { foo: :bar }
    end

    def create
      render json: { code: 0 }
    end
  end
end
