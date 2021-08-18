# frozen_string_literal: true
module Docs
  module Objects
    class BlockDatabaseColumn < BlockAttachment
      field :key, String, "key", null: false
      field :type, String, "type", null: false
      field :title, String, "title", null: true
    end
  end
end
