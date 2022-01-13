# frozen_string_literal: true
require 'faraday'
require 'faraday/net_http'

module Brickdoc
  module PreviewBox
    def self.add_connection
      @connection = Faraday.new(
        url: 'https://iframe.ly',
        params: { api_key: BrickdocConfig.iframely_api_access_key },
      ) do |faraday|
        faraday.request :url_encoded
        faraday.response :json
        faraday.adapter :net_http
      end
    end

    def self.preview(url)
      response = @connection.get('/api/iframely', { url: url })

      if response.status == 200
        body = response.body || {}
        meta = body["meta"] || {}
        links = body["links"] || {}
        thumbnail = (links["thumbnail"] || [])[0] || {}
        files = (links["file"] || [])

        data = {
          title: meta["title"] || url,
          description: meta["description"],
          cover: thumbnail["href"],
          type: "website"
        }

        if meta["medium"] == "image"
          data[:type] = "image"
        elsif meta["medium"] == 'file'
          file = files.detect { |f| f["href"] == url } || {}
          data[:type] = file["type"] || "unknown"
          data[:size] = file["content_length"]
        end
        data
      else
        {
          title: url,
          description: '',
          cover: nil,
          type: "unknown"
        }
      end
    rescue => e
      Rails.logger.error(e)
      Rails.logger.error(e.backtrace.join("\n"))
      {
        title: url,
        description: '',
        cover: nil,
        type: "unknown"
      }
    end

    add_connection
  end
end
