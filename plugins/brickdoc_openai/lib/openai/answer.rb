# frozen_string_literal: true
module OpenAI
  class Answer
    def initialize(request)
      @request = request
    end

    def create(body)
      if body[:question].blank? || body[:examples].blank? || body[:examples_context].blank?
        raise ArgumentError, 'question, examples and examples_context is required.'
      end
      raise ArgumentError, 'documents or file is required.' if body[:documents].blank? && body[:file].blank?
      body[:model] = OpenAI::Engine::DEFAULT_ENGINE_ID if body[:model].blank?
      @request.execute(:post, "/v1/answers", body)
    end
  end
end
