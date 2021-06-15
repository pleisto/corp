# frozen_string_literal: true
module Brickdoc
  module Crdt
    module Strategies
      module ConsensusQuorum
        include Brickdoc::Crdt::ConflictResolutionStrategy
      end
    end
  end
end
