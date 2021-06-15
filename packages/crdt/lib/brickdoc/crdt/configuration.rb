# frozen_string_literal: true
require "logger"

module Brickdoc
  module Crdt
    class Configuration
      attr_accessor :store, :pub_sub, :snapshot_threshold, :logger, :callbacks, :redis_pool

      def initialize
        @store = Brickdoc::Crdt::Stores::File
        @pub_sub = Brickdoc::Crdt::PubSubs::StoreBased
        @callbacks = [Brickdoc::Crdt::Callbacks::Echo]
        @snapshot_threshold = 0
        @logger = Logger.new(STDOUT).tap { |l| l.level = Logger::INFO }
        @redis_pool = Brickdoc::Redis.pool(:object)
      end
    end
  end
end
