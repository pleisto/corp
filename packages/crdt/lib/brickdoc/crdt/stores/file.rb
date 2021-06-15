# frozen_string_literal: true

module Brickdoc
  module Crdt
    module Stores
      class File < Brickdoc::Crdt::Store
        attr_reader :file, :key

        def initialize(opts)
          @key = "#{opts.fetch(:document_identity_obj).fetch(:tenant_id)}/#{opts.fetch(:document_identity_obj).fetch(:doc_id)}"
          @file = Tempfile.new(@key)
          super
        end

        def read_raw
          @file.rewind
          data = @file.read
          return nil if data.blank?
          Marshal.load(data)
        end

        def write_raw(data)
          @file.close
          @file.unlink

          @file = Tempfile.new(@key)
          @file.write(Marshal.dump(data))
          @file.rewind

          :ok
        end

        def data_get(_identity, key)
          read_raw.to_h[data_key(key)]
        end

        def data_set(_identity, key, value)
          data = read_raw.to_h.merge(data_key(key) => value)
          write_raw(data)
        end

        def data_delete(_identity, key)
          data = read_raw.to_h
          data.delete(data_key(key))
          write_raw(data)
        end

        def array_add(_identity, key, value, uniq: true)
          data = read_raw.to_h
          ary = data[data_key(key)]
          if ary && !ary.is_a?(Array)
            raise("#{key} is not a array!")
          end

          ary = ary.to_a.push(value)
          ary = ary.uniq if uniq
          write_raw(data.merge(data_key(key) => ary))
        end

        def array_remove(_identity, key, value)
          data = read_raw.to_h
          ary = data[data_key(key)]
          if ary && !ary.is_a?(Array)
            raise("#{key} is not a array!")
          end

          ary = ary.to_a
          ary.delete(value)
          write_raw(data.merge(data_key(key) => ary))
        end

        def fetch_seqs(_identity)
          read_raw.to_h["seqs"].to_h
        end

        def persist_seqs!(_identity, seqs)
          data = read_raw.to_h.merge("seqs" => seqs)
          write_raw(data)
        end

        private

        def data_key(key)
          "data_#{key}"
        end
      end
    end
  end
end
