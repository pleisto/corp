# frozen_string_literal: true

module Brickdoc
  module Crdt
    class Fragment
      TYPES = [Brickdoc::Crdt::DDS::Map, Brickdoc::Crdt::DDS::Cell, Brickdoc::Crdt::DDS::Counter].index_by(&:name)
      attr_reader :type, :slug, :allow_actions, :doc, :fragment_identity_obj
      include Redis::Objects

      lock :seq_increment, expiration: 3.minutes

      def initialize(doc:, fragment_identity_obj:)
        @type = fragment_identity_obj.fetch(:type)
        @slug = fragment_identity_obj.fetch(:slug)
        @_dds = TYPES[@type] || raise("UNKNOWN TYPE: #{@type}")
        @allow_actions = @_dds.allow_actions
        @fragment_identity_obj = fragment_identity_obj
        @doc = doc
      end

      def id
        "#{doc.document_identity_key}/#{type}/#{slug}"
      end

      def invoke(payload)
        action = payload.fetch(:action)
        raise("ACTION NOT ALLOWED: #{type}, #{action}") if action.in?(allow_actions)

        callback_obj = Brickdoc::Crdt::Callback.new(doc.document_identity_obj, fragment_identity_obj, payload)

        code, message = Brickdoc::Crdt::Callback.call(:before_invoke_async, callback_obj)
        return [code, message] unless code.zero?

        blk = -> {
          new_seq, new_gseq = Brickdoc::Crdt.configuration.redis_pool.with do |redis|
            seq = redis.hincrby(doc.redis_seqs_key, "#{type}/#{slug}", 1)
            gseq = redis.incr(doc.redis_global_seq_key)

            [seq, gseq]
          end
          change = Brickdoc::Crdt::Change.new(identities, new_seq, new_gseq, doc.store, payload)
          callback_obj.change = change

          code, message = Brickdoc::Crdt::Callback.call(:before_invoke_sync, callback_obj)
          return [code, message] unless code.zero?

          code, result = @_dds.send(action, change)
          callback_obj.code = code
          callback_obj.result = result

          code, message = Brickdoc::Crdt::Callback.call(:after_invoke_sync, callback_obj)
          return [code, message] unless code.zero?

          [code, result, callback_obj]
        }

        if @_dds.should_lock?
          code, result, callback_obj = seq_increment.lock do
            blk.call
          end
        else
          blk.call
        end

        code, message = Brickdoc::Crdt::Callback.call(:after_invoke_async, callback_obj)
        return [code, message] unless code.zero?

        patch = Brickdoc::Crdt::Patch.new(code: code, result: result, callback_obj: callback_obj)

        [code, patch]
      rescue => e
        [-1, [e.message, *e.backtrace].join(",")]
      end
    end
  end
end
