# frozen_string_literal: true

module Brickdoc
  module Yrb
    module SyncProtocol
      MESSAGE_YJS_SYNC_STEP1 = 0
      MESSAGE_YJS_SYNC_STEP2 = 1
      MESSAGE_YJS_UPDATE = 2

      def self.write_sync_step1(stream, doc)
        stream.write_var_uint(MESSAGE_YJS_SYNC_STEP1)
        sv = doc.encode_state_vector_v2
        stream.write_var_uint8_array(sv)
      end

      def self.write_sync_step2(stream, doc, vector)
        stream.write_var_uint(MESSAGE_YJS_SYNC_STEP2)
        update = doc.encode_state_as_update_v2(vector)
        stream.write_var_uint8_array(update)
      end

      def self.read_sync_step1(reader, writer, doc)
        vector = reader.read_var_uint8_array
        write_sync_step2(writer, doc, vector)
      end
    end
  end
end
