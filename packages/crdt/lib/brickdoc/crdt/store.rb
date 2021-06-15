# frozen_string_literal: true

module Brickdoc
  module Crdt
    class Store
      def initialize(_opts)
      end

      def data_get(_identity, _key)
        raise("NOT IMPLEMENT!")
      end

      def data_set(_identity, _key, _value)
        raise("NOT IMPLEMENT!")
      end

      def data_delete(_identity, _key)
        raise("NOT IMPLEMENT!")
      end

      def array_add(_identity, _key, _value)
        raise("NOT IMPLEMENT!")
      end

      def array_remove(_identity, _key, _value)
        raise("NOT IMPLEMENT!")
      end

      def fetch_seqs(_identity)
        raise("NOT IMPLEMENT!")
      end

      def persist_seqs!(_identity, _seqs)
        raise("NOT IMPLEMENT!")
      end
    end
  end
end
