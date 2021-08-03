# frozen_string_literal: true
module Docs
  module Objects
    class BlockMeta < BrickGraphQL::BaseObject
      field :icon, BlockIcon, 'icon', null: true
      field :cover, BlockCover, 'cover', null: true
      field :image, BlockImage, 'image', null: true
      field :level, Int, 'Prosemirror builtin level', null: true
    end
  end
end
