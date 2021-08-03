# frozen_string_literal: true
module Docs
  module Objects
    class BlockImage < BlockAttachment
      field :aspect_ratio, Float, 'aspect ratio', null: true
    end
  end
end
