# frozen_string_literal: true

Dir[File.join(__dir__, "yrb", "**", "*.rb")].each { |file| require file }

module Brickdoc
  module Yrb
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
