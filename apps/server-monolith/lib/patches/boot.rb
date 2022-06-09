# frozen_string_literal: true

require_relative '../brickdoc_ext'
require 'fast_underscore'
require_relative 'array'
require_relative 'string'
require_relative 'hash'

# Do not include the rails patches here,
# this file will be loaded by `/config/boot.rb` it is earlyer than rails load.
Hash.prepend Patches::Hash
String.prepend Patches::String
Array.prepend Patches::Array
