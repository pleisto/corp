# frozen_string_literal: true

module Brickdoc
  module Yrb
    module Lib0
      class Encoding
        attr_reader :cbuf, :cpos, :bufs

        BUFFER_SIZE = 100

        def initialize(cbuf = [])
          @cpos = 0
          @cbuf = cbuf
          @bufs = []
        end

        def length
          @bufs.map(&:length).sum + @cpos
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

        def write_var_uint8_array(array)
          write_var_uint(array.length)
          write_unit8_array(array)
        end

        def to_uint8_array
          @bufs.dup.push(@cbuf)
        end

        def write_unit8_array(array)
          @cpos += array.length
          @cbuf += array
        end

        def write_var_uint(value)
          loop do
            byte = value & 127
            value = value >> 7

            if value == 0
              write_byte(byte)
              return
            end

            write_byte(byte | 128)
          end
        end

        def read_byte
          value = @cbuf[@cpos]
          @cpos += 1
          value
        end

        def write_byte(value)
          if @cbuf.length >= BUFFER_SIZE
            @bufs.push(@cbuf)
            @cbuf = []
            @cpos = 0
          end

          @cbuf.push(value & 255)
          @cpos += 1
        end
      end
    end
  end
end
