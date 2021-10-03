# frozen_string_literal: true

settings do
  field :access_token, type: :encrypted, default: ENV['OPENAI_ACCESS_TOKEN']
end
