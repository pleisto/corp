# frozen_string_literal: true

module System
  class Queries::PreviewBox < BrickGraphQL::BaseResolver
    description 'return preview box data of url'
    type System::Objects::PreviewBox, null: false
    argument :url, GraphQL::Types::String, required: true

    def resolve(url:)
      preview_html = cache_fragment(expires_in: 3.hours) do
        Onebox.preview(url).to_s
      rescue
        "<a href='#{url}'>#{url}</a>"
      end
      {
        url: url,
        html: preview_html
      }
    end
  end
end
