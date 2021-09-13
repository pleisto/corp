# frozen_string_literal: true
module BrickdocPlugin::GithubWebhook
  class EventsController < ActionController::Base
    skip_before_action :verify_authenticity_token

    before_action :load_block

    def index
      render json: { code: 0, msg: 'ok', data: { block: @block.attributes, row_length: @block.descendants.count } }
    end

    # https://github.com/brickdoc/brickdoc/settings/hooks/314374472/deliveries
    def create
      if @block.data['columns'].blank?
        action_uuid = SecureRandom.uuid
        columns = [{ key: action_uuid, type: "text", title: "action" }]
        @block.update!(data: { columns: columns })
      else
        action_uuid = @block.data['columns'].first.fetch('key')
      end

      action_data = params.fetch(:action)

      max_sort = @block.descendants.where(type: 'databaseRow').maximum(:sort) || 0

      row_params = {
        pod_id: @block.pod_id,
        collaborators: @block.collaborators,
        type: "databaseRow",
        parent_id: @block.id,
        root_id: @block.id,
        meta: {},
        data: { action_uuid => action_data },
        sort: max_sort + 10
      }

      row = Docs::Block.create!(row_params)

      render json: { code: 0, msg: "ok", data: row.attributes }
    rescue => e
      render json: { code: -1, msg: e.message }
    end

    private

    def load_block
      @block = Docs::Block.unscoped.find(params.fetch(:uuid))
      raise "block type wrong" unless @block.type == "tableBlock"
      raise "block is deleted" unless @block.deleted_at
    end
  end
end
