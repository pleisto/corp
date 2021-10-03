# frozen_string_literal: true
module OpenAI
  class Classification
    def initialize(request)
      @request = request
    end

    def create(body)
      raise ArgumentError, 'query is required.' if body[:query].blank?
      raise ArgumentError, 'examples or file is required.' if body[:examples].blank? && body[:file].blank?
      body[:model] = OpenAI::Engine::DEFAULT_ENGINE_ID if body[:model].blank?
      @request.execute(:post, "/v1/classifications", body)
    end
  end
end
