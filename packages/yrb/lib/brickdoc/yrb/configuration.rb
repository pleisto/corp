# frozen_string_literal: true
require "logger"

module Brickdoc
  module Yrb
    class Configuration
      attr_accessor :logger

      def initialize
        @logger = Logger.new(STDOUT).tap { |l| l.level = Logger::INFO }
      end
    end
  end
end
