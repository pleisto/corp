# frozen_string_literal: true

module Brickdoc
  module Yrb
    module Domain
      class AbstractStruct
        attr_reader :id, :length
        attr_accessor :deleted

        def initialize(id, length)
          @id = id
          @length = length
        end

        def merge_with(_right)
        end

        def delete(_transaction)
        end

        def integrate(_transaction, _offset)
        end

        def get_missing(_transaction, _store)
        end

        def write(_encoding, _offset)
        end
      end
    end
  end
end
