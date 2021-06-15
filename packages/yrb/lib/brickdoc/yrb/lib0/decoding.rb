# frozen_string_literal: true

module Brickdoc
  module Yrb
    module Lib0
      class Decoding
        attr_reader :pos, :arr

        def initialize(arr = [])
          @pos = 0
          @arr = arr
        end

        def read_var_uint8_array
          read_uint8_array(read_var_uint)
        end

        def read_uint8_array(len)
        end

        def read_var_uint
          shift = 0
          result = 0

          loop do
            byte = read_byte
            result |= (byte & 127) << shift
            shift += 7

            break if (byte & 128) == 0 || shift >= 35
          end

          result
        end

        def read_byte
          value = @arr[@pos]
          @pos += 1
          value
        end

        def write_byte(value)
          @arr.push(value & 255)
        end
      end
    end
  end
end
