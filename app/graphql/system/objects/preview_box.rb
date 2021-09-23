# frozen_string_literal: true
module System
  module Objects
    class PreviewBox < BrickGraphQL::BaseObject
      graphql_name 'preview_box'

      field :html, String, 'preview html', null: false
      field :url, String, 'preview url', null: false
    end
  end
end
