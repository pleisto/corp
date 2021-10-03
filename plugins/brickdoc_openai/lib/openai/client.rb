# frozen_string_literal: true
module OpenAI
  class Client
    def initialize(access_token)
      @request = OpenAI::Request.new access_token
    end

    def engines
      OpenAI::Engine.new @request
    end

    def classifications
      OpenAI::Classification.new @request
    end

    def answers
      OpenAI::Answer.new @request
    end

    def files
      OpenAI::File.new @request
    end
  end
end
