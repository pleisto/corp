# frozen_string_literal: true

Dir[File.join(__dir__, "crdt", "**", "*.rb")].each { |file| require file }

module Brickdoc
  module Crdt
    def self.configuration
      @configuration ||= Configuration.new
    end

    def self.reset
      @configuration = Configuration.new
    end

    def self.configure
      yield(configuration)
    end
  end
end
