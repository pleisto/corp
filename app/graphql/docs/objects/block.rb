# frozen_string_literal: true
module Docs
  module Objects
    class Block < Objects::BlockBaseObject
      graphql_name 'block'
      description 'Brickdoc Docs::Block'

      has_primary_key uuid: true
    end
  end
end
