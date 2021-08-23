# frozen_string_literal: true
module BrickdocPlugin::GithubWebhook
  class EventsController < ActionController::Base
    skip_before_action :verify_authenticity_token

    def index
      render json: { foo: :bar }
    end

    def create
      _block = Docs::Block.find(params.fetch(:uuid))
      Rails.logger.info("logger #{params}")
      puts("puts #{params}")
      render json: { code: 0, msg: "ok" }
    rescue => e
      render json: { code: -1, msg: e.message }
    end
  end
end
