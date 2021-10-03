# frozen_string_literal: true
module OpenAI
  class Engine
    DEFAULT_ENGINE_ID = 'davinci-instruct-beta'
    def initialize(request)
      @request = request
    end

    def all
      @request.execute(:get, '/v1/engines')
    end

    def find(engine_id)
      @request.execute(:get, "/v1/engines/#{engine_id}")
    end

    def create_completion(body, engine_id = DEFAULT_ENGINE_ID)
      raise ArgumentError, 'prompt is required.' if body[:prompt].blank?
      @request.execute(:post, "/v1/engines/#{engine_id}/completions", body)
    end

    def create_search(body, engine_id = DEFAULT_ENGINE_ID)
      raise ArgumentError, 'documents or file is required.' if body[:documents].blank? && body[:file].blank?
      raise ArgumentError, 'query is required.' if body[:query].blank?
      @request.execute(:post, "/v1/engines/#{engine_id}/search", body)
    end
  end
end
