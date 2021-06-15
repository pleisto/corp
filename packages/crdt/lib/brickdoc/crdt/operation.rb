# frozen_string_literal: true

module Brickdoc
  module Crdt
    class Operation
      ## Operation type
      attr_accessor :op

      attr_accessor :target
    end
  end
end
