# frozen_string_literal: true

module Brickdoc
  module Yrb
    module Domain
      class Ydoc
        attr_reader :client_id, :sub_docs, :store

        def initialize(opts = nil)
          opts ||= YdocOptions.new
          @_opts = opts
          @client_id = new_client_id
          @_share = {}

          @should_load = opts.auto_load
          @gc = opts.gc
          @guid = opts.guid
          @meta = opts.meta
          @gc_filter = opts.gc_filter

          @sub_docs = {}

          @_transaction = nil
          @_transaction_cleanups = []

          @_item = nil

          @store = StructStore.new

          @event_handlers = {}
        end

        def load
          if !@_item.nil? && (@should_load == false)
            @_item.parent.doc.transact(
              ->(tr) { tr.sub_docs_loaded.add(self) }, nil, true
            )
          end
          @should_load = true
        end

        def create_snapshot
          Snapshot.new(DeleteSet.new(store), store.state_vector)
        end

        def destroy
          sub_docs.each(&:destroy)

          if @_item
            content = @_item.content
            if _item.deleted
              content.doc = nil if content
            else
              content.opts.guid = guid
              content.doc = Doc.new(content.opts)
              content.doc._item = @_item
            end

            @item.parent.doc.transact(
              ->(tr) {
                tr.sub_docs_added.add(content.doc) unless @_item.deleted
                tr.sub_docs_removed.add(self)
              }, nil, true
            )
          end

          @event_handlers[:destroy_handler]&.invoke(self, nil)
        end

        def new_client_id
          SecureRandom.uuid
        end

        def transact(fn, origin = nil, local = true)
          initial_call = false

          if @_transaction.nil?
            initial_call = true
            @_transaction = Transaction.new(self, origin, local)
            @_transaction_cleanups << @_transaction
            if @_transaction_cleanups.one?
              @event_handlers[:before_all_transactions]&.invoke(self, nil)
            end

            @event_handlers[:before_transactions]&.invoke(self, @_transaction)
          end

          begin
            fn.call(@_transaction)
          rescue => e
            puts(e.message)
          ensure
            if initial_call && (@_transaction_cleanups.first == @_transaction)
              Transaction.cleanup_transactions(@_transaction_cleanups, 0)
            end
          end
        end

        def apply_update_v2(input, origin = nil, local = false)
          transact(
            ->(tr) {
              decoder = UpdateDecoderV2.new(input)
              decoder.read_struct(tr, store)
              store.read_and_apply_delete_set(decoder, tr)
            }, origin, local
          )
        end

        def encode_state_as_update_v2(vector = nil)
        end

        def encode_state_vector_v2
        end

        def write_state_vector
        end
      end
    end
  end
end
