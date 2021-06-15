# frozen_string_literal: true

module Brickdoc
  module Yrb
    module Domain
      class YdocOptions
        DEFAULT_FILTER = ->(_) { true }

        attr_reader :guid, :gc, :gc_filter, :meta, :auto_load

        def initialize(_opts = nil)
          @gc = true
          @gc_filter = DEFAULT_FILTER
          @guid = SecureRandom.uuid
          @meta = {}
          @auto_load = false
        end
      end
    end
  end
end
