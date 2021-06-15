# frozen_string_literal: true

module Brickdoc
  module Crdt
    class Doc
      attr_reader :document_identity_obj, :document_identity_key, :store, :redis_seqs_key

      def initialize(opts)
        @document_identity_obj = opts.fetch(:document_identity_obj)
        @document_identity_key = "#{@document_identity_obj.fetch(:tenant_id)}/#{@document_identity_obj.fetch(:doc_id)}"
        @_opts = opts

        @store = Brickdoc::Crdt.configuration.store.new(**opts)
        @redis_seqs_key = "document_seqs:#{@document_identity_key}"
        @redis_global_seq_key = "document_global_seq:#{@document_identity_key}"
      end

      def pub_sub
        @pub_sub ||= Brickdoc::Crdt.configuration.pub_sub.new(self)
      end

      def subscribe(actor)
        @pub_sub.subscribe(actor)
      end

      def unsubscribe(actor)
        @pub_sub.unsubscribe(actor)
      end

      def fetch_seqs
        store.fetch_seqs(document_identity_obj)
      end

      def redis_restore
        seqs = fetch_seqs
        Brickdoc::Crdt.configuration.redis_pool.with do |redis|
          redis.mapped_hmset(redis_seqs_key, seqs)
          gseq = seqs["global"].to_i
          redis.hset(redis_global_seq_key, gseq)
        end if seqs.present?
      end

      def redis_cleanup
        Brickdoc::Crdt.configuration.redis_pool.with do |redis|
          seqs = redis.hgetall(redis_seqs_key)
          gseq = redis.get(redis_global_seq_key).to_i
          seqs = seqs.merge("global" => gseq)
          store.persist_seqs!(document_identity_obj, seqs)
          redis.del(redis_seqs_key)
          redis.del(redis_global_seq_key)
        end
      end

      def inner_invoke(fragment_identity_obj, payload)
        code, result = new_fragment(fragment_identity_obj).invoke(payload)

        if result.is_a?(Brickdoc::Crdt::Patch) && result.broadcast
          pub_sub.broadcast(result.content)
        end

        [code, result]
      end

      def invoke(fragment_identity_obj, payload)
        inner_invoke.tap do |code, result|
          if code.zero?
            logger.info("[#{document_identity_obj}] #{fragment_identity_obj} #{payload} -> #{result}")
          else
            logger.error("<#{code}> [#{document_identity_obj}] #{fragment_identity_obj} #{payload} -> #{result}")
          end
        end
      end

      def new_fragment(fragment_identity_obj)
        Brickdoc::Crdt::Fragment.new(doc: self, fragment_identity_obj: fragment_identity_obj)
      end

      def logger
        @logger ||= Brickdoc::Crdt.configuration.logger
      end
    end
  end
end
