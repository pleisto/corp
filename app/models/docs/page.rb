# frozen_string_literal: true
class Docs::Page < Docs::Block
  store :meta, [:title, :tags]
end
