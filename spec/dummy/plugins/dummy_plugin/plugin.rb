# frozen_string_literal: true

settings do
  field :test_plugin_key, default: 'value2'
end

on :test_hook do |arg|
  arg[:done] = true
end
