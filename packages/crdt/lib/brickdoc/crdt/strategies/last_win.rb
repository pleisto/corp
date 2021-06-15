# frozen_string_literal: true
module Brickdoc
  module Crdt
    module Strategies
      module LastWin
        include Brickdoc::Crdt::ConflictResolutionStrategy
      end
    end
  end
end
