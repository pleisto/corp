# frozen_string_literal: true
module Docs
  class Objects::TextBlock < Objects::BlockBaseObject
    description "text blocks"

    def self.data_payload
      [
        {
          name: :content,
          type: String,
          description: 'Text Content',
          opts: { null: false }
        },
      ]
    end

    field(:data, data_object, null: false)
  end
end
