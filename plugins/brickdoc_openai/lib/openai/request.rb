# frozen_string_literal: true
module OpenAI
  class Error < StandardError; end

  class Request
    API_ENDPOINT = 'https://api.openai.com'

    attr_reader :access_token

    def initialize(access_token)
      @access_token = access_token
    end

    def execute(method, path, params = {}, headers = {})
      resp = client.public_send(method, path, params, headers)
      body = Oj.load(resp.body, mode: :compat) unless resp.body.strip.empty?
      resp.success? && body.present? ? body : request_error(body, resp.status)
    end

    private

    def request_error(body, status)
      msg = body.present? ?
      "#{body['error']['type']}: #{body['error']['message']}" :
      "http status code: #{status}"
      raise OpenAI::Error, msg
    end

    def client
      @_client ||= Faraday.new(url: API_ENDPOINT) do |c|
        c.request :json
        c.adapter Faraday.default_adapter
        c.headers['Authorization'] = "Bearer #{@access_token}"
      end
    end
  end
end
